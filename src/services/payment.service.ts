import Razorpay from 'razorpay';
import { prisma } from '@/lib/db';
import { PAYMENT_STATUS, BOOKING_STATUS } from '@/lib/constants';
import crypto from 'crypto';
import { AppError } from '@/lib/errors';

// Lazy initialization to avoid build-time crash
let _razorpay: InstanceType<typeof Razorpay> | null = null;
function getRazorpay() {
  if (!_razorpay) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new AppError('Razorpay credentials are not set', 500);
    }
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return _razorpay;
}

const createOrder = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });
  
  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  const amountInPaisa = Math.round(booking.totalAmount * 100);

  const razorpay = getRazorpay();
  const order = await razorpay.orders.create({
    amount: amountInPaisa,
    currency: 'INR',
    receipt: bookingId,
  });

  // Use upsert to handle payment retry (prevents unique constraint crash)
  await prisma.payment.upsert({
    where: { bookingId },
    create: {
      bookingId,
      razorpayOrderId: order.id,
      amount: amountInPaisa, // Store in paisa (matches schema comment)
      status: PAYMENT_STATUS.CREATED,
    },
    update: {
      razorpayOrderId: order.id,
      amount: amountInPaisa,
      status: PAYMENT_STATUS.CREATED,
    }
  });

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: BOOKING_STATUS.PAYMENT_PENDING }
  });

  return order;
};

const verifyPayment = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId }: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  bookingId: string;
}) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new AppError('Razorpay secret not configured', 500);
  }

  // Verify HMAC signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');

  // Use timing-safe comparison to prevent timing attacks
  const isValid = crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(razorpay_signature, 'hex')
  );

  if (!isValid) {
    throw new AppError('Invalid payment signature', 400);
  }

  // Verify that the order actually belongs to this booking (prevents IDOR)
  const payment = await prisma.payment.findFirst({
    where: { razorpayOrderId: razorpay_order_id }
  });

  if (!payment) {
    throw new AppError('Payment record not found for this order', 404);
  }

  if (payment.bookingId !== bookingId) {
    throw new AppError('Payment does not belong to this booking', 403);
  }

  if (payment.status === PAYMENT_STATUS.PAID) {
    return { verified: true, message: 'Payment already verified' };
  }

  // Update payment and booking status
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: PAYMENT_STATUS.PAID,
    }
  });

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: BOOKING_STATUS.CONFIRMED }
  });

  return { verified: true };
};

const handleWebhook = async (body: string, signature: string) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    throw new AppError('Webhook secret not configured', 500);
  }

  // Use correct Razorpay SDK method for webhook validation
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  const isValid = crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(signature, 'hex')
  );

  if (!isValid) {
    throw new AppError('Invalid webhook signature', 400);
  }

  const event = JSON.parse(body);

  if (event.event === 'payment.captured') {
    const paymentEntity = event.payload.payment.entity;
    const orderId = paymentEntity.order_id;
    
    const payment = await prisma.payment.findFirst({
      where: { razorpayOrderId: orderId }
    });

    if (payment && payment.status !== PAYMENT_STATUS.PAID) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: PAYMENT_STATUS.PAID }
      });
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: BOOKING_STATUS.CONFIRMED }
      });
    }
  }

  return { success: true };
};

export const paymentService = { createOrder, verifyPayment, handleWebhook };
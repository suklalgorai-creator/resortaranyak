import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { BOOKING_STATUS, PAYMENT_STATUS } from '@/lib/constants';
import { AppError, ConflictError, NotFoundError } from '@/lib/errors';
import { hashOpaqueToken, safeCompareHex } from '@/lib/security';

let razorpayClient: InstanceType<typeof Razorpay> | null = null;

async function serializable<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.$transaction(callback, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034' && attempt < 2) continue;
      throw error;
    }
  }
  throw new ConflictError('Payment operation conflicted with another request');
}

function getRazorpay(): InstanceType<typeof Razorpay> {
  if (!razorpayClient) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) throw new AppError('Payment service is not configured', 503);
    razorpayClient = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return razorpayClient;
}

function assertSignature(expected: string, actual: string) {
  if (!safeCompareHex(expected, actual)) throw new AppError('Invalid payment signature', 400);
}

function isExpired(expiresAt: Date | null): boolean {
  return !expiresAt || expiresAt.getTime() <= Date.now();
}

async function createOrder(checkoutToken: string) {
  const tokenHash = hashOpaqueToken(checkoutToken);
  return serializable(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { accessTokenHash: tokenHash },
      include: { payments: true, room: true },
    });
    if (!booking) throw new NotFoundError('Checkout session not found');
    if (booking.status === BOOKING_STATUS.CONFIRMED) throw new ConflictError('Booking is already confirmed');
    if (booking.status === BOOKING_STATUS.CANCELLED || booking.status === BOOKING_STATUS.EXPIRED) {
      throw new ConflictError('Booking is no longer payable');
    }
    if (isExpired(booking.expiresAt)) {
      await tx.booking.update({ where: { id: booking.id }, data: { status: BOOKING_STATUS.EXPIRED } });
      throw new ConflictError('Checkout session has expired');
    }

    const existingAttempt = booking.payments.find((payment) =>
      [PAYMENT_STATUS.CREATED, PAYMENT_STATUS.AUTHORIZED].includes(payment.status as never) && payment.razorpayOrderId,
    );
    if (existingAttempt?.razorpayOrderId) {
      return {
        id: existingAttempt.razorpayOrderId,
        amount: existingAttempt.amount,
        currency: existingAttempt.currency,
      };
    }

    const amount = booking.totalAmount * 100;
    if (!Number.isSafeInteger(amount) || amount <= 0) throw new AppError('Invalid booking amount', 500);

    const order = await getRazorpay().orders.create({
      amount,
      currency: 'INR',
      receipt: booking.bookingCode,
      notes: { bookingId: booking.id },
    });

    await tx.payment.create({
      data: {
        bookingId: booking.id,
        razorpayOrderId: order.id,
        amount,
        currency: 'INR',
        status: PAYMENT_STATUS.CREATED,
      },
    });
    await tx.booking.update({
      where: { id: booking.id },
      data: { status: BOOKING_STATUS.PAYMENT_PENDING },
    });

    return order;
  });
}

async function verifyPayment({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  checkoutToken,
}: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  checkoutToken: string;
}) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new AppError('Payment service is not configured', 503);
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  assertSignature(expectedSignature, razorpay_signature);

  const booking = await prisma.booking.findUnique({
    where: { accessTokenHash: hashOpaqueToken(checkoutToken) },
    include: { payments: true },
  });
  if (!booking) throw new NotFoundError('Checkout session not found');

  const attempt = booking.payments.find((payment) => payment.razorpayOrderId === razorpay_order_id);
  if (!attempt) throw new AppError('Payment attempt not found', 404);
  if (attempt.status === PAYMENT_STATUS.CAPTURED) return { verified: true, bookingCode: booking.bookingCode };
  if (booking.status === BOOKING_STATUS.CANCELLED || booking.status === BOOKING_STATUS.EXPIRED || isExpired(booking.expiresAt)) {
    throw new ConflictError('Booking is no longer payable');
  }

  let providerOrder: { id: string; amount: string | number; currency: string };
  let providerPayment: { id: string; order_id: string; amount: string | number; currency: string; status: string };
  try {
    providerOrder = await getRazorpay().orders.fetch(razorpay_order_id);
    providerPayment = await getRazorpay().payments.fetch(razorpay_payment_id);
  } catch {
    throw new AppError('Unable to verify payment with payment provider', 502);
  }

  if (
    providerOrder.id !== attempt.razorpayOrderId ||
    Number(providerOrder.amount) !== attempt.amount ||
    providerOrder.currency !== attempt.currency ||
    providerPayment.order_id !== attempt.razorpayOrderId ||
    Number(providerPayment.amount) !== attempt.amount ||
    providerPayment.currency !== attempt.currency ||
    providerPayment.status !== 'captured'
  ) {
    throw new AppError('Payment details do not match the booking', 400);
  }

  await serializable(async (tx) => {
    await tx.$queryRaw(Prisma.sql`SELECT "id" FROM "Booking" WHERE "id" = ${booking.id} FOR UPDATE`);
    const lockedBooking = await tx.booking.findUnique({ where: { id: booking.id } });
    const lockedAttempt = await tx.payment.findUnique({ where: { id: attempt.id } });
    if (!lockedBooking || !lockedAttempt) throw new NotFoundError('Payment attempt not found');
    if (lockedAttempt.status === PAYMENT_STATUS.CAPTURED) return;
    if (lockedBooking.status === BOOKING_STATUS.CANCELLED || lockedBooking.status === BOOKING_STATUS.EXPIRED || isExpired(lockedBooking.expiresAt)) {
      throw new ConflictError('Booking is no longer payable');
    }

    await tx.payment.update({
      where: { id: lockedAttempt.id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: PAYMENT_STATUS.CAPTURED,
        providerMetadata: providerPayment as unknown as Prisma.InputJsonValue,
      },
    });
    await tx.booking.update({
      where: { id: lockedBooking.id },
      data: { status: BOOKING_STATUS.CONFIRMED, expiresAt: null },
    });
  });

  return { verified: true, bookingCode: booking.bookingCode };
}

async function handleWebhook(body: string, signature: string, eventId: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new AppError('Webhook service is not configured', 503);
  const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');
  assertSignature(expectedSignature, signature);

  let event: {
    event?: string;
    payload?: { payment?: { entity?: Record<string, unknown> } };
  };
  try {
    event = JSON.parse(body) as typeof event;
  } catch {
    throw new AppError('Invalid webhook payload', 400);
  }
  if (!event.event || !event.payload?.payment?.entity) throw new AppError('Unsupported webhook payload', 400);

  const payloadHash = crypto.createHash('sha256').update(body).digest('hex');
  try {
    await prisma.webhookEvent.create({
      data: {
        eventId,
        eventType: event.event,
        payloadHash,
        payload: event as unknown as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { success: true, duplicate: true };
    }
    throw error;
  }

  try {
    const entity = event.payload.payment.entity;
    const orderId = typeof entity.order_id === 'string' ? entity.order_id : null;
    const paymentId = typeof entity.id === 'string' ? entity.id : null;
    const amount = typeof entity.amount === 'number' ? entity.amount : null;
    const currency = typeof entity.currency === 'string' ? entity.currency : null;
    if (!orderId || !paymentId || amount === null || !currency) throw new AppError('Invalid payment event', 400);

    await serializable(async (tx) => {
      const attempt = await tx.payment.findUnique({ where: { razorpayOrderId: orderId } });
      if (!attempt) throw new NotFoundError('Payment attempt not found');
      if (attempt.amount !== amount || attempt.currency !== currency) throw new ConflictError('Payment amount mismatch');

      const booking = await tx.booking.findUnique({ where: { id: attempt.bookingId } });
      if (!booking) throw new NotFoundError('Booking not found');
      if (attempt.status === PAYMENT_STATUS.CAPTURED) return;

      if (event.event === 'payment.captured') {
        await tx.payment.update({
          where: { id: attempt.id },
          data: { razorpayPaymentId: paymentId, status: PAYMENT_STATUS.CAPTURED, providerMetadata: entity as Prisma.InputJsonValue },
        });
        if (booking.status === BOOKING_STATUS.HOLD || booking.status === BOOKING_STATUS.PAYMENT_PENDING) {
          if (booking.expiresAt && booking.expiresAt.getTime() > Date.now()) {
            await tx.booking.update({ where: { id: booking.id }, data: { status: BOOKING_STATUS.CONFIRMED, expiresAt: null } });
          } else {
            await tx.booking.update({ where: { id: booking.id }, data: { status: BOOKING_STATUS.EXPIRED } });
          }
        }
      } else if (event.event === 'payment.failed') {
        await tx.payment.update({ where: { id: attempt.id }, data: { status: PAYMENT_STATUS.FAILED, failureReason: 'Razorpay payment failed', providerMetadata: entity as Prisma.InputJsonValue } });
        if (booking.status === BOOKING_STATUS.PAYMENT_PENDING) {
          await tx.booking.update({ where: { id: booking.id }, data: { status: BOOKING_STATUS.FAILED } });
        }
      }
    });

    await prisma.webhookEvent.update({ where: { eventId }, data: { status: 'PROCESSED', processedAt: new Date() } });
    return { success: true, duplicate: false };
  } catch (error) {
    await prisma.webhookEvent.update({ where: { eventId }, data: { status: 'FAILED' } }).catch(() => undefined);
    throw error;
  }
}

export const paymentService = { createOrder, verifyPayment, handleWebhook };

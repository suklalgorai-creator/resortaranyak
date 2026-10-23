import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/services/payment.service';
import { AppError } from '@/lib/errors';
import { checkoutTokenSchema } from '@/validations/booking.schema';
import { enforceRateLimit } from '@/lib/rate-limit';
import { z } from 'zod/v4';

export async function POST(req: NextRequest) {
  const limited = await enforceRateLimit(req, 'payment:create-order', 5, 60);
  if (limited) return limited;

  try {
    const validated = checkoutTokenSchema.parse(await req.json());
    const order = await paymentService.createOrder(validated.checkoutToken);
    
    return NextResponse.json({ 
      success: true, 
      data: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      }
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid checkout session' }, { status: 400 });
    }
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    if (!(error instanceof AppError)) console.error('Payment order creation failed', error);
    return NextResponse.json({ success: false, error: error instanceof AppError ? error.message : 'Unable to create payment order' }, { status: statusCode });
  }
}

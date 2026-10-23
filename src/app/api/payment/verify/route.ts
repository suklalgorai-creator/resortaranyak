import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/services/payment.service';
import { verifyPaymentSchema } from '@/validations/payment.schema';
import { AppError } from '@/lib/errors';
import { enforceRateLimit } from '@/lib/rate-limit';
import { z } from 'zod/v4';

export async function POST(req: NextRequest) {
  const limited = await enforceRateLimit(req, 'payment:verify', 10, 60);
  if (limited) return limited;

  try {
    const body = await req.json();
    const validatedData = verifyPaymentSchema.parse(body);
    
    const result = await paymentService.verifyPayment(validatedData);
    
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid payment verification request' }, { status: 400 });
    }
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    if (!(error instanceof AppError)) console.error('Payment verification failed', error);
    return NextResponse.json({ success: false, error: error instanceof AppError ? error.message : 'Unable to verify payment' }, { status: statusCode });
  }
}

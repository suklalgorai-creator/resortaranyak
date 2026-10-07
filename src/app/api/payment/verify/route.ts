import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/services/payment.service';
import { verifyPaymentSchema } from '@/validations/payment.schema';
import { AppError } from '@/lib/errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = verifyPaymentSchema.parse(body);
    
    const result = await paymentService.verifyPayment(validatedData);
    
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ success: false, error: error.message }, { status: statusCode });
  }
}
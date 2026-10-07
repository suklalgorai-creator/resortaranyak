import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/services/payment.service';
import { AppError } from '@/lib/errors';

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-razorpay-signature');
    if (!signature) {
      throw new AppError('Missing signature', 400);
    }

    const rawBody = await req.text();
    await paymentService.handleWebhook(rawBody, signature);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ success: false, error: error.message }, { status: statusCode });
  }
}
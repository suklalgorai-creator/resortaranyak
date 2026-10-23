import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/services/payment.service';
import { AppError } from '@/lib/errors';
import { enforceRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const limited = await enforceRateLimit(req, 'payment:webhook', 120, 60);
  if (limited) return limited;

  try {
    const signature = req.headers.get('x-razorpay-signature');
    const eventId = req.headers.get('x-razorpay-event-id');
    if (!signature) {
      throw new AppError('Missing signature', 400);
    }
    if (!eventId) throw new AppError('Missing event ID', 400);

    const rawBody = await req.text();
    await paymentService.handleWebhook(rawBody, signature, eventId);
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    if (!(error instanceof AppError)) console.error('Payment webhook failed', error);
    return NextResponse.json({ success: false, error: error instanceof AppError ? error.message : 'Webhook processing failed' }, { status: statusCode });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/services/payment.service';
import { AppError } from '@/lib/errors';

export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json();
    if (!bookingId) {
      throw new AppError('Booking ID is required', 400);
    }
    
    const order = await paymentService.createOrder(bookingId);
    
    return NextResponse.json({ 
      success: true, 
      data: {
        ...order,
        key_id: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error: any) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ success: false, error: error.message }, { status: statusCode });
  }
}
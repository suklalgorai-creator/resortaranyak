import { NextRequest, NextResponse } from 'next/server';
import { bookingService } from '@/services/booking.service';
import { AppError } from '@/lib/errors';

export async function GET(req: NextRequest, { params }: { params: Promise<{ bookingId: string }> }) {
  try {
    const { bookingId } = await params;
    const booking = await bookingService.getById(bookingId);
    return NextResponse.json({ success: true, data: booking });
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
    }
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
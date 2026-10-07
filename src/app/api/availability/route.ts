import { NextRequest, NextResponse } from 'next/server';
import { bookingService } from '@/services/booking.service';
import { checkAvailabilitySchema } from '@/validations/booking.schema';
import { AppError } from '@/lib/errors';
import { z } from 'zod/v4';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const roomId = searchParams.get('roomId');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');

    // Pass strings to Zod (schema expects strings)
    const validatedData = checkAvailabilitySchema.parse({
      roomId,
      checkIn,
      checkOut,
    });

    // Convert to Date after validation
    const availability = await bookingService.checkAvailability(
      validatedData.roomId,
      new Date(validatedData.checkIn),
      new Date(validatedData.checkOut)
    );

    return NextResponse.json({ success: true, data: availability });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
    }
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
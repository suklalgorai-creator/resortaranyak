import { NextRequest, NextResponse } from 'next/server';
import { bookingService } from '@/services/booking.service';
import { checkAvailabilitySchema } from '@/validations/booking.schema';
import { AppError } from '@/lib/errors';
import { z } from 'zod/v4';
import { enforceRateLimit } from '@/lib/rate-limit';
import { parseDateOnly } from '@/lib/security';

export async function GET(req: NextRequest) {
  const limited = await enforceRateLimit(req, 'availability', 30, 60);
  if (limited) return limited;

  try {
    const searchParams = req.nextUrl.searchParams;
    const roomId = searchParams.get('roomId');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');

    const validatedData = checkAvailabilitySchema.parse({
      roomId,
      checkIn,
      checkOut,
    });

    const availability = await bookingService.checkAvailability(
      validatedData.roomId,
      parseDateOnly(validatedData.checkIn),
      parseDateOnly(validatedData.checkOut),
    );

    return NextResponse.json({ success: true, data: availability });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
    }
    console.error('Availability lookup failed', error);
    return NextResponse.json({ success: false, error: 'Unable to check availability' }, { status: 500 });
  }
}

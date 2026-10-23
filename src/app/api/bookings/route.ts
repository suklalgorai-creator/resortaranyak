import { NextRequest, NextResponse } from 'next/server';
import { bookingService } from '@/services/booking.service';
import { createBookingSchema } from '@/validations/booking.schema';
import { AppError } from '@/lib/errors';
import { z } from 'zod/v4';
import { enforceRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const limited = await enforceRateLimit(req, 'booking:create', 5, 60);
  if (limited) return limited;

  try {
    const body = await req.json();
    const validatedData = createBookingSchema.parse(body);

    const idempotencyKey = req.headers.get('idempotency-key');
    if (!idempotencyKey || idempotencyKey.length < 32 || idempotencyKey.length > 128) {
      return NextResponse.json({ success: false, error: 'A valid Idempotency-Key is required' }, { status: 400 });
    }

    const result = await bookingService.create({
      roomId: validatedData.roomId,
      checkIn: validatedData.checkIn,
      checkOut: validatedData.checkOut,
      guests: validatedData.guests,
      guestName: validatedData.guestName,
      guestEmail: validatedData.guestEmail,
      guestPhone: validatedData.guestPhone,
      specialRequests: validatedData.specialRequests,
      idempotencyKey,
    });

    return NextResponse.json({
      success: true,
      data: {
        booking: {
          id: result.booking.id,
          bookingCode: result.booking.bookingCode,
          nights: result.booking.nights,
          totalAmount: result.booking.totalAmount,
          status: result.booking.status,
          expiresAt: result.booking.expiresAt,
        },
        checkoutToken: idempotencyKey,
        reused: result.reused,
      },
    }, { status: result.reused ? 200 : 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
    }
    console.error('Booking creation failed', error);
    return NextResponse.json({ success: false, error: 'Unable to create booking' }, { status: 500 });
  }
}

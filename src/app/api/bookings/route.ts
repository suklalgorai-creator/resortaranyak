import { NextRequest, NextResponse } from 'next/server';
import { bookingService } from '@/services/booking.service';
import { createBookingSchema } from '@/validations/booking.schema';
import { AppError } from '@/lib/errors';
import { z } from 'zod/v4';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate as strings first (Zod schema expects strings for dates)
    const validatedData = createBookingSchema.parse(body);
    
    // Convert validated string dates to Date objects for the service
    const booking = await bookingService.create({
      roomId: validatedData.roomId,
      checkIn: new Date(validatedData.checkIn),
      checkOut: new Date(validatedData.checkOut),
      guests: validatedData.guests,
      guestName: validatedData.guestName,
      guestEmail: validatedData.guestEmail,
      guestPhone: validatedData.guestPhone,
      specialRequests: validatedData.specialRequests,
    });
    
    return NextResponse.json({ success: true, data: booking });
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
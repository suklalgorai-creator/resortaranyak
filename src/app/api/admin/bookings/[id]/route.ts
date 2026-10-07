import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { bookingService } from '@/services/booking.service';
import { BOOKING_STATUS } from '@/lib/constants';
import { AppError } from '@/lib/errors';
import { z } from 'zod/v4';

const validStatuses = Object.values(BOOKING_STATUS);
const updateStatusSchema = z.object({
  status: z.enum(validStatuses as [string, ...string[]]),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const booking = await bookingService.getById(id);
    return NextResponse.json({ success: true, data: booking });
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch booking' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    
    // Validate status against allowed enum values
    const { status } = updateStatusSchema.parse(body);
    const booking = await bookingService.updateStatus(id, status);
    return NextResponse.json({ success: true, data: booking });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid status value', details: error.issues }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ success: false, error: 'Failed to update booking status' }, { status: 500 });
  }
}

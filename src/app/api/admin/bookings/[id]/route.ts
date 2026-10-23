import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { bookingService } from '@/services/booking.service';
import { BOOKING_STATUS } from '@/lib/constants';
import { AppError } from '@/lib/errors';
import { z } from 'zod/v4';
import { hasAdminRole } from '@/lib/authz';

const updateStatusSchema = z.object({
  status: z.enum([
    BOOKING_STATUS.CONFIRMED,
    BOOKING_STATUS.CANCELLED,
    BOOKING_STATUS.CANCEL_REQUESTED,
    BOOKING_STATUS.EXPIRED,
    BOOKING_STATUS.FAILED,
    BOOKING_STATUS.COMPLETED,
  ]),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !(await hasAdminRole(session.user?.id))) {
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
  if (!session || !(await hasAdminRole(session.user?.id))) {
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

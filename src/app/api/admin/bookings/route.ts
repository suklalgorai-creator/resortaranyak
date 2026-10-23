import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { bookingService } from '@/services/booking.service';
import { hasAdminRole } from '@/lib/authz';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || !(await hasAdminRole(session.user?.id))) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const page = Math.max(1, Math.min(10_000, Number.parseInt(searchParams.get('page') || '1', 10) || 1));

  try {
    const bookings = await bookingService.getAll({ status, page });
    return NextResponse.json({ success: true, data: bookings });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

// GET /api/bookings/[bookingId] — Get booking details
export async function GET() {
  return NextResponse.json({ message: 'Booking detail API — Coming in Phase 5' });
}

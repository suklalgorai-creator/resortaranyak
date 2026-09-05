import { NextResponse } from 'next/server';

// POST /api/bookings — Create booking
export async function POST() {
  return NextResponse.json({ message: 'Booking API — Coming in Phase 5' });
}

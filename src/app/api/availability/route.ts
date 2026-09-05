import { NextResponse } from 'next/server';

// GET /api/availability — Check room availability
export async function GET() {
  return NextResponse.json({ message: 'Availability API — Coming in Phase 5' });
}

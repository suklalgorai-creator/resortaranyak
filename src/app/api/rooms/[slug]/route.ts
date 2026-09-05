import { NextResponse } from 'next/server';

// GET /api/rooms/[slug] — Get room by slug
export async function GET() {
  return NextResponse.json({ message: 'Room detail API — Coming in Phase 4' });
}

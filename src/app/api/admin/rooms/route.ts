import { NextResponse } from 'next/server';

// POST /api/admin/rooms — Create room (admin)
export async function POST() {
  return NextResponse.json({ message: 'Admin rooms API — Coming in Phase 4' });
}

export async function GET() {
  return NextResponse.json({ message: 'Admin rooms list API — Coming in Phase 4' });
}

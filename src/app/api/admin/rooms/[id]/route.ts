import { NextResponse } from 'next/server';

export async function PATCH() {
  return NextResponse.json({ message: 'Admin room update API — Coming in Phase 4' });
}

export async function DELETE() {
  return NextResponse.json({ message: 'Admin room delete API — Coming in Phase 4' });
}

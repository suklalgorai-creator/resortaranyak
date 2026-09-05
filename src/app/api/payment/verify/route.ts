import { NextResponse } from 'next/server';

// POST /api/payment/verify
export async function POST() {
  return NextResponse.json({ message: 'Payment verify API — Coming in Phase 6' });
}

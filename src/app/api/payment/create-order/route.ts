import { NextResponse } from 'next/server';

// POST /api/payment/create-order
export async function POST() {
  return NextResponse.json({ message: 'Payment order API — Coming in Phase 6' });
}

import { NextResponse } from 'next/server';

// POST /api/payment/webhook — Razorpay webhook
export async function POST() {
  return NextResponse.json({ message: 'Webhook API — Coming in Phase 6' });
}

import { NextResponse } from 'next/server';

// POST /api/enquiries — Submit contact form
export async function POST() {
  return NextResponse.json({ message: 'Enquiry API — Coming in Phase 8' });
}

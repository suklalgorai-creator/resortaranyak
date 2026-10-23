import { NextRequest, NextResponse } from 'next/server';
import { roomService } from '@/services/room.service';
import { AppError } from '@/lib/errors';
import { z } from 'zod/v4';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const room = await roomService.getPublicBySlug(slug);
    return NextResponse.json({ success: true, data: room });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
    }
    console.error('Room lookup failed', error);
    return NextResponse.json({ success: false, error: 'Unable to fetch room' }, { status: 500 });
  }
}

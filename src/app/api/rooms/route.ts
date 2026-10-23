import { NextRequest, NextResponse } from 'next/server';
import { roomService } from '@/services/room.service';
import { AppError } from '@/lib/errors';

export async function GET() {
  try {
    const rooms = await roomService.getAll();
    return NextResponse.json({ success: true, data: rooms });
  } catch (error: unknown) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    if (!(error instanceof AppError)) console.error('Room list failed', error);
    return NextResponse.json({ success: false, error: error instanceof AppError ? error.message : 'Unable to fetch rooms' }, { status: statusCode });
  }
}

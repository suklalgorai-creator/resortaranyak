import { NextRequest, NextResponse } from 'next/server';
import { roomService } from '@/services/room.service';
import { AppError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const rooms = await roomService.getAll();
    return NextResponse.json({ success: true, data: rooms });
  } catch (error: any) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ success: false, error: error.message }, { status: statusCode });
  }
}
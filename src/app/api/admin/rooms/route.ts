import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { roomService } from '@/services/room.service';
import { createRoomSchema } from '@/validations/room.schema';
import { AppError } from '@/lib/errors';
import { z } from 'zod/v4';
import { hasAdminRole } from '@/lib/authz';

export async function GET() {
  const session = await auth();
  if (!session || !(await hasAdminRole(session.user?.id))) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const rooms = await roomService.getAll();
    return NextResponse.json({ success: true, data: rooms });
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch rooms' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !(await hasAdminRole(session.user?.id))) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validatedData = createRoomSchema.parse(body);
    const room = await roomService.create(validatedData);
    return NextResponse.json({ success: true, data: room }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ success: false, error: 'Failed to create room' }, { status: 500 });
  }
}

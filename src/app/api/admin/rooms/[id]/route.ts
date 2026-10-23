import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { roomService } from '@/services/room.service';
import { updateRoomSchema } from '@/validations/room.schema';
import { AppError } from '@/lib/errors';
import { z } from 'zod/v4';
import { hasAdminRole } from '@/lib/authz';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !(await hasAdminRole(session.user?.id))) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = updateRoomSchema.parse(body);
    const room = await roomService.update(id, validatedData);
    return NextResponse.json({ success: true, data: room });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
    }
    const message = error instanceof Error ? error.message : 'Failed to update room';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !(await hasAdminRole(session.user?.id))) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const room = await roomService.getById(id);
    return NextResponse.json({ success: true, data: room });
  } catch (error: unknown) {
    if (error instanceof AppError) return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
    console.error('Admin room lookup failed', error);
    return NextResponse.json({ success: false, error: 'Unable to fetch room' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !(await hasAdminRole(session.user?.id))) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;
    await roomService.deactivate(id);
    return NextResponse.json({ success: true, message: 'Room deactivated successfully' });
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ success: false, error: 'Failed to deactivate room' }, { status: 500 });
  }
}

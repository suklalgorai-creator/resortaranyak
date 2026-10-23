import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { enquiryService } from '@/services/enquiry.service';
import { hasAdminRole } from '@/lib/authz';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || !(await hasAdminRole(session.user?.id))) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Math.min(10_000, Number.parseInt(searchParams.get('page') || '1', 10) || 1));

  try {
    const enquiries = await enquiryService.getAll(page);
    return NextResponse.json({ success: true, data: enquiries });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session || !(await hasAdminRole(session.user?.id))) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Id is required' }, { status: 400 });
    }
    const enquiry = await enquiryService.markAsRead(id);
    return NextResponse.json({ success: true, data: enquiry });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update enquiry' }, { status: 500 });
  }
}

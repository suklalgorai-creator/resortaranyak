import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { dashboardService } from '@/services/dashboard.service';
import { hasAdminRole } from '@/lib/authz';

export async function GET() {
  const session = await auth();
  if (!session || !(await hasAdminRole(session.user?.id))) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const [stats, recentBookings, recentEnquiries] = await Promise.all([
      dashboardService.getStats(),
      dashboardService.getRecentBookings(5),
      dashboardService.getRecentEnquiries(5),
    ]);
    return NextResponse.json({ success: true, data: { stats, recentBookings, recentEnquiries } });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}

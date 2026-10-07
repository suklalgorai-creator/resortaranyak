import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { dashboardService } from '@/services/dashboard.service';

export async function GET() {
  const session = await auth();
  if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const [stats, recentBookings] = await Promise.all([
      dashboardService.getStats(),
      dashboardService.getRecentBookings(5),
    ]);
    return NextResponse.json({ success: true, data: { stats, recentBookings } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}

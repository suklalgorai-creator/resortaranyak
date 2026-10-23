import { NextRequest, NextResponse } from 'next/server';
import { bookingService } from '@/services/booking.service';
import { safeCompareSecret } from '@/lib/security';

export async function POST(request: NextRequest) {
  const configuredSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get('authorization') || '';
  const suppliedSecret = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!configuredSecret || !safeCompareSecret(configuredSecret, suppliedSecret)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const result = await bookingService.expireExpiredBookings();
  return NextResponse.json({ success: true, expired: result.count });
}

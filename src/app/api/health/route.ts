import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: 'ok',
      service: 'resort-arranyak',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check failed', error);
    return NextResponse.json({
      status: 'error',
      service: 'resort-arranyak',
      database: 'unavailable',
      timestamp: new Date().toISOString(),
    }, { status: 503 });
  }
}

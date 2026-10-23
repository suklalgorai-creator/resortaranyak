import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';

function requestAddress(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip') || 'unknown';
}

export async function enforceRateLimit(
  request: NextRequest,
  scope: string,
  limit: number,
  windowSeconds: number,
): Promise<NextResponse | null> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowSeconds * 1000);
  const key = `${scope}:${requestAddress(request)}`.slice(0, 180);

  try {
    await prisma.$executeRaw(Prisma.sql`
      INSERT INTO "RateLimitBucket" ("key", "windowStart", "expiresAt", "count")
      VALUES (${key}, ${now}, ${expiresAt}, 1)
      ON CONFLICT ("key") DO UPDATE SET
        "windowStart" = CASE
          WHEN "RateLimitBucket"."expiresAt" <= ${now} THEN ${now}
          ELSE "RateLimitBucket"."windowStart"
        END,
        "expiresAt" = CASE
          WHEN "RateLimitBucket"."expiresAt" <= ${now} THEN ${expiresAt}
          ELSE "RateLimitBucket"."expiresAt"
        END,
        "count" = CASE
          WHEN "RateLimitBucket"."expiresAt" <= ${now} THEN 1
          ELSE "RateLimitBucket"."count" + 1
        END
    `);

    const bucket = await prisma.rateLimitBucket.findUnique({ where: { key } });
    if (!bucket || bucket.count <= limit) return null;

    const retryAfter = Math.max(1, Math.ceil((bucket.expiresAt.getTime() - Date.now()) / 1000));
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  } catch (error) {
    console.error('Rate limiter unavailable', { scope, error });
    return NextResponse.json(
      { success: false, error: 'Service temporarily unavailable. Please try again later.' },
      { status: 503, headers: { 'Retry-After': '30' } },
    );
  }
}

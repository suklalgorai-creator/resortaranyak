import { handlers } from '@/lib/auth';
import { enforceRateLimit } from '@/lib/rate-limit';
import { NextRequest } from 'next/server';
export const { GET } = handlers;

export async function POST(request: NextRequest) {
  if (request.nextUrl.pathname.endsWith('/callback/credentials')) {
    const limited = await enforceRateLimit(request, 'auth:credentials', 5, 300);
    if (limited) return limited;
  }
  return handlers.POST(request);
}

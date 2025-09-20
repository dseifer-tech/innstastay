import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, validateOrigin, SECURITY_HEADERS } from './lib/security';

export function middleware(request: NextRequest) {
  const res = NextResponse.next();

  // Security headers everywhere
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(k, v);
  }

  const path = request.nextUrl.pathname;

  // CORS/rate-limit ONLY for API
  if (path.startsWith('/api/')) {
    const rate = checkRateLimit(request);
    if (!rate.allowed) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
    const origin = request.headers.get('origin');
    if (validateOrigin(origin)) {
      res.headers.set('Access-Control-Allow-Origin', origin!);
    }
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.headers.set('Access-Control-Max-Age', '86400');
  }

  // Staging: noindex for all HTML pages (not just admin/api)
  const accept = request.headers.get('accept') || '';
  if (accept.includes('text/html')) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  // Extra security headers
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  return res;
}

export const config = {
  // run on everything except static assets
  matcher: ['/((?!_next|assets|favicon.ico).*)'],
};

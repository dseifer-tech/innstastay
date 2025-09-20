import { NextRequest, NextResponse } from 'next/server';
import { validateOrigin, SECURITY_HEADERS } from './lib/security';
import { ENV } from './lib/env';

const user = ENV.BASIC_AUTH_USER;
const pass = ENV.BASIC_AUTH_PASS;

function needsAuth() { 
  return !!(user && pass) && ENV.NODE_ENV !== "development"; 
}

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="staging"' },
  });
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Skip static assets and Next internals
  if (/^\/(_next|assets|favicon\.ico)/.test(path)) {
    return NextResponse.next();
  }

  // Basic auth
  if (needsAuth()) {
    const header = req.headers.get("authorization") || "";
    if (!header.startsWith("Basic ")) return unauthorized();
    const [, b64] = header.split(" ");
    const [u, p] = Buffer.from(b64, "base64").toString().split(":");
    if (u !== user || p !== pass) return unauthorized();
  }

  const res = NextResponse.next();

  // Security headers everywhere
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(k, v);
  }

  // Per-IP rate limit for /api/*
  const isApi = path.startsWith("/api/");
  if (isApi) {
    const ip = req.ip ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    // naive in-memory bucket (resets on cold start)
    const key = `rl:${ip}`;
    const now = Date.now();
    // @ts-ignore - attach to global
    global.__RL = global.__RL || new Map<string, { t: number; c: number }>();
    const store: Map<string, { t: number; c: number }> = (global as any).__RL;
    const windowMs = 60_000; // 1 min
    const limit = 60;        // requests / min
    const rec = store.get(key);
    if (!rec || now - rec.t > windowMs) {
      store.set(key, { t: now, c: 1 });
    } else {
      rec.c += 1;
      if (rec.c > limit) return new NextResponse("Too Many Requests", { status: 429 });
    }

    // CORS for API
    const origin = req.headers.get('origin');
    if (validateOrigin(origin)) {
      res.headers.set('Access-Control-Allow-Origin', origin!);
    }
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.headers.set('Access-Control-Max-Age', '86400');
  }

  // Staging: noindex for all HTML pages (not just admin/api)
  const accept = req.headers.get('accept') || '';
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

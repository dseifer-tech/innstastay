import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkRateLimit, validateOrigin, SECURITY_HEADERS } from './lib/security'
import { getRedirectsCached } from './lib/cms/redirects'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  // Redirects (Sanity-managed)
  const redirects = await getRedirectsCached()
  const hit = redirects.find(r => r.fromPath === url.pathname)
  if (hit) {
    const to = new URL(hit.toPath, url)
    return NextResponse.redirect(to, hit.status)
  }
  const response = NextResponse.next()

  // Security: Add security headers to all responses
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Security: Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const rateLimit = checkRateLimit(request)
    
    if (!rateLimit.allowed) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            ...SECURITY_HEADERS
          }
        }
      )
    }

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', '60')
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
    response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString())
  }

  // Security: CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin')
    
    if (validateOrigin(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin!)
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Max-Age', '86400')
  }

  // Security: Set noindex headers for API and admin routes
  if (request.nextUrl.pathname.startsWith('/api/') || 
      request.nextUrl.pathname.startsWith('/admin/') ||
      request.nextUrl.pathname.startsWith('/admin-server/')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }

  // Security: Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')
  
  // Security: Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // Security: XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block')

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*',
    '/admin-server/:path*',
  ],
}

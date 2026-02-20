import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const path = req.nextUrl.pathname;

  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  res.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

  if (process.env.NODE_ENV === 'production') {
    res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  if (path.startsWith('/api/')) {
    // Don’t let proxies cache API responsess
    res.headers.set('Cache-Control', 'no-store');
  }

  return res;
}

// Avoid applying middleware to static assets / Next internals
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

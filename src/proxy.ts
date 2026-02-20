import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const res = NextResponse.next();

  const nonce = crypto.randomUUID().replace(/-/g, '');
  const isDev = process.env.NODE_ENV !== 'production';
  const path = req.nextUrl.pathname;

  res.headers.set('Content-Security-Policy', csp({ nonce, isDev }));

  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  res.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

  if (!isDev) {
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

function csp({ nonce, isDev }: { nonce: string; isDev: boolean }) {
  const scriptSrc = isDev ? `'self' 'nonce-${nonce}' 'unsafe-eval'` : `'self' 'nonce-${nonce}'`;
  const styleSrc = `'self' 'unsafe-inline'`;

  return [
    `default-src 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `frame-ancestors 'none'`,
    `form-action 'self'`,
    `img-src 'self' data: https:`,
    `font-src 'self' data:`,
    `style-src ${styleSrc}`,
    `script-src ${scriptSrc}`,
    `connect-src 'self'`,
  ].join('; ');
}

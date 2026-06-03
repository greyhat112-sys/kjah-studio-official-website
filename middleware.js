import { NextResponse } from 'next/server';

/**
 * Coming-soon redirect.
 * To launch the full site: delete this file (or rename to middleware.js.disabled).
 */
const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
  Pragma: 'no-cache',
  Expires: '0',
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === '/coming-soon') {
    const res = NextResponse.next();
    for (const [k, v] of Object.entries(NO_CACHE_HEADERS)) res.headers.set(k, v);
    return res;
  }

  const res = NextResponse.redirect(new URL('/coming-soon', request.url), 307);
  for (const [k, v] of Object.entries(NO_CACHE_HEADERS)) res.headers.set(k, v);
  return res;
}

export const config = {
  matcher: [
    /*
     * Run on all routes except:
     *  - /api/*               (contact form endpoint stays live)
     *  - /_next/static, /_next/image
     *  - /assets/*
     *  - /favicon.ico, /robots.txt, /sitemap.xml, /manifest.json
     *  - /opengraph-image
     *  - any path containing a dot (static files: .png, .jpg, .svg, etc.)
     */
    '/((?!api|_next/static|_next/image|assets|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.json|opengraph-image|.*\\..*).*)',
  ],
};

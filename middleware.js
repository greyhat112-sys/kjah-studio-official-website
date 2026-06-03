import { NextResponse } from 'next/server';

/**
 * Coming-soon redirect.
 * To launch the full site: delete this file (or rename to middleware.js.disabled).
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;
  if (pathname === '/coming-soon') {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL('/coming-soon', request.url));
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

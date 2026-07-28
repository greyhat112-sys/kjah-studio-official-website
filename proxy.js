import { NextResponse } from 'next/server';

/**
 * Coming-soon / maintenance redirect.
 *
 * Next 16 renamed the `middleware` file convention to `proxy` — the exported
 * function must be named `proxy` (or be the default export). See
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 *
 * To bring the site back online: delete this file.
 */
const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
  Pragma: 'no-cache',
  Expires: '0',
};

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname === '/coming-soon') {
    const res = NextResponse.next();
    for (const [k, v] of Object.entries(NO_CACHE_HEADERS)) res.headers.set(k, v);
    return res;
  }

  // 307 (temporary) is deliberate — it tells Google the real page still owns
  // this URL, so the indexed homepage survives a short maintenance window.
  const res = NextResponse.redirect(new URL('/coming-soon', request.url), 307);
  for (const [k, v] of Object.entries(NO_CACHE_HEADERS)) res.headers.set(k, v);
  return res;
}

export const config = {
  matcher: [
    /*
     * Run on all routes except:
     *  - /api/*               (contact + audit form endpoint stays live)
     *  - /_next/static, /_next/image
     *  - /assets/*
     *  - /favicon.ico, /robots.txt, /sitemap.xml, /manifest.json
     *  - /opengraph-image
     *  - any path containing a dot (static files: .png, .jpg, .svg, etc.)
     */
    '/((?!api|_next/static|_next/image|assets|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.json|opengraph-image|.*\\..*).*)',
  ],
};

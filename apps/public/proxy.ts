import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

// Create the next-intl middleware handler
const intlMiddleware = createMiddleware(routing);

/**
 * Next.js 16 Proxy Function
 *
 * This replaces the old `middleware.ts` file. In Next.js 16:
 * - File must be named `proxy.ts` (not middleware.ts)
 * - Must export a named function called `proxy` (not default export)
 * - Runs on Node.js runtime (not Edge) for better compatibility
 *
 * Purpose:
 * - Enforces trailing slashes on all routes (adds them if missing)
 * - Handles locale detection and redirects (e.g., "/" → "/en/")
 * - Runs on every request before it reaches your pages
 * - Intercepts requests at the network boundary
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. TRAILING SLASH ENFORCEMENT
  // Add trailing slashes to all routes (trailingSlash: true behavior)
  // Exception: Skip static files and API routes
  if (!pathname.endsWith('/')) {
    // Don't add trailing slash to static assets
    if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/assets/') ||
      pathname.startsWith('/api/')
    ) {
      return NextResponse.next();
    }

    // Don't add trailing slash to files with extensions (e.g., /favicon.ico, /manifest.json)
    if (/\.[^/]+$/.test(pathname)) {
      return NextResponse.next();
    }

    // Add trailing slash: /en/about-me → /en/about-me/
    const url = request.nextUrl.clone();
    url.pathname = pathname + '/';

    // 301 Permanent Redirect (good for SEO, tells browsers to cache the redirect)
    return NextResponse.redirect(url, { status: 301 });
  }

  // 2. LOCALE HANDLING
  // Delegate to next-intl middleware to handle:
  // - Locale detection from Accept-Language header
  // - Redirect "/" to "/en/" (default locale with trailing slash)
  // - Add locale prefix to all routes
  return intlMiddleware(request);
}

// Matcher config: Run proxy on all routes EXCEPT:
// - /api/* (API routes)
// - /_next/* (Next.js static files)
// - Files with extensions (*.jpg, *.css, etc.)
export const config = {
  matcher: '/((?!api|trpc|_next|.*\\..*).*)',
};

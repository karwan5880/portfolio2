import { NextResponse } from 'next/server'

/**
 * Middleware for handling legacy URL redirects
 * Redirects old portfolio URLs to the new multiverse format
 */
export function middleware(request) {
  // DISABLED ALL REDIRECTS - NO MORE MULTIVERSE REDIRECTS!
  return NextResponse.next()
}

/**
 * Configure which paths the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - multiverse (already the target route)
     * - root path (/) - let it load the ScrollPortfolio
     */
    '/((?!api|_next/static|_next/image|favicon.ico|multiverse|^$).*)',
  ],
}

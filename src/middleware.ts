import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Block public access to projects route
  if (pathname === '/projects') {
    // Redirect to homepage instead of showing 404
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Ensure main domain redirects to homepage
  if (pathname === '/' && request.headers.get('host')?.includes('techxak.com')) {
    // This ensures the main homepage is properly served
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};


import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle non-existent blog tag routes - redirect to blog page
  if (pathname.startsWith('/blog/tag/')) {
    return NextResponse.redirect(new URL('/blog', request.url), 301);
  }
  
  // Handle non-existent blog category routes - redirect to blog page
  if (pathname.startsWith('/blog/category/')) {
    return NextResponse.redirect(new URL('/blog', request.url), 301);
  }
  
  // Handle non-existent contact page - redirect to schedule appointment
  if (pathname === '/contact') {
    return NextResponse.redirect(new URL('/schedule-meeting', request.url), 301);
  }
  
  // Handle non-existent services page - redirect to homepage
  if (pathname === '/services') {
    return NextResponse.redirect(new URL('/', request.url), 301);
  }
  
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


import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Check for auth cookie
  const session = request.cookies.get('session');

  if (!session && request.nextUrl.pathname.startsWith('/gifts')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/gifts/:path*',
};
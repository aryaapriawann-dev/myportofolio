import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const adminCookie = request.cookies.get('oft_admin');
  
  if (!adminCookie || adminCookie.value !== '1') {
    if (pathname === '/admin' || pathname === '/admin/') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  if (pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};

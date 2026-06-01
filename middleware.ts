import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('sb-access-token');
  const { pathname } = req.nextUrl;

  // Protect dashboard and admin routes
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // SEO-friendly: force HTTPS + canonical domain
  if (req.nextUrl.protocol !== 'https:') {
    return NextResponse.redirect(`https://chotaurl.pro${pathname}`);
  }

  return NextResponse.next();
}

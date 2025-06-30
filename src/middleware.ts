import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { HttpStatusCode } from './lib/enum';
import { PUBLIC_ROUTE } from './constants/app-routes';

const publicRoutes = (Object.values(PUBLIC_ROUTE) as string[]).filter(
  (path) => path !== '#' && path !== '*'
);
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
  if (isPublicRoute) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const now = Math.floor(Date.now() / 1000);
  const isApiRoute = pathname.startsWith('/api');

  if (!token) {
    if (isApiRoute) {
      return NextResponse.json(
        { message: 'Unauthorized: Token missing or expired' },
        { status: HttpStatusCode.UNAUTHORIZED }
      );
    } else {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/';
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (token.exp && token.exp < now) {
    if (isApiRoute) {
      return new NextResponse(
        JSON.stringify({ message: 'Token expired' }),
        { status: HttpStatusCode.UNAUTHORIZED }
      );
    } else {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/';
      return NextResponse.redirect(redirectUrl);
    }
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', token.sub || '');
  requestHeaders.set('x-user-role', token.role || '');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|images|fonts|auth|api/auth).*)'],
};
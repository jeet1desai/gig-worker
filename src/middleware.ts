import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

import {
  PUBLIC_ROUTE,
  PUBLIC_API_ROUTES,
  excludedPublicRoutes,
  PRIVATE_ROUTE
} from '@/constants/app-routes';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { ADMIN_ROLE } from './constants';

const publicRoutes = Object.values(PUBLIC_ROUTE) as string[];
const privateRoutes = Object.values(PRIVATE_ROUTE) as string[];

export async function middleware(req: NextRequest) {
  if (req.headers.get('upgrade') === 'websocket') {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;
  const isApiRoute = pathname.startsWith('/api');
  const publicApiRoutes = Object.values(PUBLIC_API_ROUTES) as string[];
  const isPublicApiRoute =
    publicApiRoutes.includes(pathname) || pathname.startsWith('/api/public/');
  const isExplicitPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  const isExplicitPrivateRoute = privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  const isDynamicTopLevelRoute = /^\/[a-z0-9-/]+$/i.test(pathname);
  const isDynamicPublicRoute =
    isDynamicTopLevelRoute && !isExplicitPrivateRoute;

  const isPublicRoute = isExplicitPublicRoute || isDynamicPublicRoute;

  if (isPublicApiRoute) return NextResponse.next();

  const isPublicUserProfile = /^\/profile\/[^/]+$/.test(pathname);
  if (isPublicUserProfile) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const now = Math.floor(Date.now() / 1000);

  const isRestrictedPublicRoute = excludedPublicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  if (isPublicRoute) {
    if (token && token.exp > now && isRestrictedPublicRoute) {
      const url = req.nextUrl.clone();
      if (token.role === ADMIN_ROLE) {
        url.pathname = PRIVATE_ROUTE.ADMIN_DASHBOARD_PATH;
      } else {
        url.pathname = PRIVATE_ROUTE.DASHBOARD;
      }
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

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
      return new NextResponse(JSON.stringify({ message: 'Token expired' }), {
        status: HttpStatusCode.UNAUTHORIZED
      });
    } else {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/';
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (token && token.exp > now) {
    const isAccessingPlanPage =
      pathname === PRIVATE_ROUTE.PLANS ||
      pathname.startsWith(PRIVATE_ROUTE.PLANS + '/');
    const isActiveSubscription = token.subscription;
    if (
      !isApiRoute &&
      !isActiveSubscription &&
      !isAccessingPlanPage &&
      !isPublicRoute &&
      token.role !== ADMIN_ROLE
    ) {
      const url = req.nextUrl.clone();
      url.pathname = PRIVATE_ROUTE.PLANS;
      return NextResponse.redirect(url);
    }
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', token.sub || '');
  requestHeaders.set('x-user-role', token.role || '');

  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|images|fonts|icons|auth|api/auth|api/cms|api/faqs|api/working_steps).*)'
  ]
};

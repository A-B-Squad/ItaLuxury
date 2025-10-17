import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isTokenExpiringSoon, validateToken } from "./utlils/tokens/token";

const ALLOWED_ORIGINS = [
  process.env.NEXT_ALLOW_REQUEST_API_URL,
  process.env.NEXT_PUBLIC_BASE_URL_DOMAIN,
  "http://api.preprod.konnect.network",
  "https://graph.facebook.com",
].filter((origin): origin is string => Boolean(origin));

const AUTH_ROUTES = ["/signin", "/signup"];
const PROTECTED_ROUTES = [
  "/Account",
  "/FavoriteList",
];

const TOKEN_COOKIE_NAME = "Token";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // CORS handling
  const origin = req.headers.get("origin");
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }

  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: res.headers });
  }

  // Auth handling
  const url = req.nextUrl.pathname;
  const token = req.cookies.get(TOKEN_COOKIE_NAME)?.value;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_DOMAIN;

  if (!baseUrl) {
    console.error("NEXT_PUBLIC_BASE_URL_DOMAIN is not defined");
    return res;
  }

  // Check if current route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    url.startsWith(route) || url === route
  );

  // Check if current route is auth route
  const isAuthRoute = AUTH_ROUTES.includes(url);

  // If user has token and tries to access auth routes, redirect to home
  if (token && isAuthRoute) {
    const isValidToken = validateToken(token);
    if (isValidToken) {
      return NextResponse.redirect(new URL(baseUrl, req.url));
    } else {
      // Token is invalid, remove it and allow access to auth routes
      const response = NextResponse.next();
      response.cookies.delete(TOKEN_COOKIE_NAME);
      return response;
    }
  }

  // If user tries to access protected routes without valid token, redirect to signin
  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    const isValidToken = validateToken(token);
    if (!isValidToken) {
      // Token is expired or invalid, remove it and redirect to signin
      const response = NextResponse.redirect(new URL('/signin', req.url));
      response.cookies.delete(TOKEN_COOKIE_NAME);
      return response;
    }
    // Token is valid but expiring soon - add header to trigger refresh on client
    if (isTokenExpiringSoon(token)) {
      res.headers.set('X-Token-Refresh-Needed', 'true');
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/signin",
    "/signup",
    "/Account/:path*",
    "/Basket/:path*",
    "/Checkout/:path*",
    "/Delivery/:path*",
    "/FavoriteList/:path*",
    "/TrackingPackages/:path*",
    "/productComparison/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
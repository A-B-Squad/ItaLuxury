import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isTokenExpiringSoon, validateToken } from "./utils/tokens/token";

// ==================== CONFIGURATION ====================

const AUTH_ROUTES = ["/signin", "/signup"];
const PROTECTED_ROUTES = ["/Account", "/FavoriteList"];
const TOKEN_COOKIE_NAME = "Token";

const getConfigByEnvironment = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    isProduction,
    allowedOrigins: [
      process.env.NEXT_ALLOW_REQUEST_API_URL,
      process.env.NEXT_PUBLIC_BASE_URL_DOMAIN,
      "https://api.preprod.konnect.network",
      "https://graph.facebook.com",
      ...(isProduction
        ? [
          "https://www.ita-luxury.com",
          "https://ita-luxury.com",
        ]
        : [
          "http://localhost:3000",
          "http://localhost:4000",
          "http://localhost:3001",
          "http://127.0.0.1:3000",
        ]
      ),
    ].filter((origin): origin is string => Boolean(origin)),

    baseUrl: isProduction
      ? 'https://www.ita-luxury.com'
      : (process.env.NEXT_PUBLIC_BASE_URL_DOMAIN || 'http://localhost:3000'),
  };
};

// ==================== HELPER FUNCTIONS ====================

// Handle HTTPS redirects in production
const handleHttpsRedirects = (req: NextRequest, isProduction: boolean): NextResponse | null => {
  if (!isProduction) return null;

  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host') || '';

  // Redirect HTTP to HTTPS
  if (url.protocol === 'http:') {
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  // Redirect to www if needed
  if (!hostname.startsWith('www.') && hostname === 'ita-luxury.com') {
    url.hostname = 'www.ita-luxury.com';
    return NextResponse.redirect(url, 301);
  }

  return null;
};

// Check if origin is allowed
const isOriginAllowed = (
  origin: string | null,
  allowedOrigins: string[],
  isProduction: boolean
): boolean => {
  if (!origin) return false;

  return allowedOrigins.some(allowed =>
    origin.startsWith(allowed) ||
    (isProduction && origin.includes('ita-luxury.com'))
  );
};

// Set CORS headers
const setCorsHeaders = (
  res: NextResponse,
  origin: string | null,
  allowedOrigins: string[],
  isProduction: boolean
): void => {
  if (isOriginAllowed(origin, allowedOrigins, isProduction)) {
    res.headers.set("Access-Control-Allow-Origin", origin!);
  }

  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
};

// Set security headers
const setSecurityHeaders = (res: NextResponse, isProduction: boolean): void => {
  if (isProduction) {
    res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
};

// Check if route is protected
const isProtectedRoute = (url: string): boolean => {
  return PROTECTED_ROUTES.some(route =>
    url.startsWith(route) || url === route
  );
};

// Check if route is auth route
const isAuthRoute = (url: string): boolean => {
  return AUTH_ROUTES.includes(url);
};

// Handle authenticated user accessing signin
const handleAuthenticatedSignin = (
  token: string,
  baseUrl: string,
  reqUrl: string
): NextResponse | null => {
  const isValidToken = validateToken(token);

  if (isValidToken) {
    return NextResponse.redirect(new URL(baseUrl, reqUrl));
  }

  // Token is invalid, remove it and allow access
  const response = NextResponse.next();
  response.cookies.delete(TOKEN_COOKIE_NAME);
  return response;
};

// Handle protected route access
const handleProtectedRouteAccess = (
  token: string | undefined,
  reqUrl: string,
  res: NextResponse
): NextResponse | null => {
  // No token - redirect to signin
  if (!token) {
    return NextResponse.redirect(new URL('/signin', reqUrl));
  }

  // Invalid token - remove and redirect to signin
  const isValidToken = validateToken(token);
  if (!isValidToken) {
    const response = NextResponse.redirect(new URL('/signin', reqUrl));
    response.cookies.delete(TOKEN_COOKIE_NAME);
    return response;
  }

  // Valid token but expiring soon - add refresh header
  if (isTokenExpiringSoon(token)) {
    res.headers.set('X-Token-Refresh-Needed', 'true');
  }

  return null;
};

// Handle authentication logic
const handleAuthentication = (
  req: NextRequest,
  res: NextResponse,
  config: ReturnType<typeof getConfigByEnvironment>
): NextResponse | null => {
  const url = req.nextUrl.pathname;
  const token = req.cookies.get(TOKEN_COOKIE_NAME)?.value;

  // Handle authenticated user trying to access signin
  if (token && isAuthRoute(url) && url === "/signin") {
    return handleAuthenticatedSignin(token, config.baseUrl, req.url);
  }

  // Handle protected route access
  if (isProtectedRoute(url)) {
    return handleProtectedRouteAccess(token, req.url, res);
  }

  return null;
};

// ==================== MAIN MIDDLEWARE FUNCTION ====================

export function middleware(req: NextRequest) {
  const config = getConfigByEnvironment();

  // Handle HTTPS redirects in production
  const httpsRedirect = handleHttpsRedirects(req, config.isProduction);
  if (httpsRedirect) return httpsRedirect;

  const res = NextResponse.next();

  // Set CORS headers
  const origin = req.headers.get("origin");
  setCorsHeaders(res, origin, config.allowedOrigins, config.isProduction);

  // Set security headers
  setSecurityHeaders(res, config.isProduction);

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: Object.fromEntries(res.headers)
    });
  }

  // Handle authentication
  const authResponse = handleAuthentication(req, res, config);
  if (authResponse) return authResponse;

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
    "/Collections/:path*",
    "/productComparison/:path*",
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|google.*\\.html).*)",
  ],
};
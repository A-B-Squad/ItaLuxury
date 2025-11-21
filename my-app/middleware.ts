import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isTokenExpiringSoon, validateToken } from "./utils/tokens/token";

//  CONFIGURATION PAR ENVIRONNEMENT
const getConfigByEnvironment = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    isProduction,
    allowedOrigins: [
      process.env.NEXT_ALLOW_REQUEST_API_URL,
      process.env.NEXT_PUBLIC_BASE_URL_DOMAIN,
      "https://api.preprod.konnect.network",
      "https://graph.facebook.com",
      // 🔥 ORIGINES SPÉCIFIQUES PAR ENVIRONNEMENT
      ...(isProduction
        ? [
          "https://www.ita-luxury.com",
          "https://ita-luxury.com",
        ]
        : [
          "http://localhost:3000",
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

const AUTH_ROUTES = ["/signin", "/signup"];
const PROTECTED_ROUTES = [
  "/Account",
  "/FavoriteList",
];

const TOKEN_COOKIE_NAME = "Token";

export function middleware(req: NextRequest) {
  const config = getConfigByEnvironment();

  //  REDIRECTIONS HTTPS UNIQUEMENT EN PRODUCTION
  if (config.isProduction) {
    const url = req.nextUrl.clone();
    const hostname = req.headers.get('host') || '';

    // Rediriger HTTP vers HTTPS
    if (url.protocol === 'http:') {
      url.protocol = 'https:';
      return NextResponse.redirect(url, 301);
    }

    // Rediriger vers www si nécessaire
    if (!hostname.startsWith('www.') && hostname === 'ita-luxury.com') {
      url.hostname = 'www.ita-luxury.com';
      return NextResponse.redirect(url, 301);
    }
  }

  const res = NextResponse.next();

  // CORS handling avec vérification par environnement
  const origin = req.headers.get("origin");
  if (origin && config.allowedOrigins.some(allowed =>
    origin.startsWith(allowed) ||
    (config.isProduction && origin.includes('ita-luxury.com'))
  )) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }

  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // HEADERS DE SÉCURITÉ DIFFÉRENTS PAR ENVIRONNEMENT
  if (config.isProduction) {
    res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: Object.fromEntries(res.headers)
    });
  }

  // Auth handling
  const url = req.nextUrl.pathname;
  const token = req.cookies.get(TOKEN_COOKIE_NAME)?.value;

  // Check if current route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    url.startsWith(route) || url === route
  );

  // Check if current route is auth route
  const isAuthRoute = AUTH_ROUTES.includes(url);

  // If user has token and tries to access signin (not signup), redirect to home
  // Allow signup page to handle its own logic
  if (token && isAuthRoute && url === "/signin") {
    const isValidToken = validateToken(token);
    if (isValidToken) {
      return NextResponse.redirect(new URL(config.baseUrl, req.url));
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
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|google.*\\.html).*)",
  ],
};
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_ORIGINS = [
  process.env.NEXT_ALLOW_REQUEST_API_URL,
  process.env.NEXT_PUBLIC_BASE_URL_DOMAIN,
  "http://api.preprod.konnect.network", 
].filter(Boolean);
const AUTH_ROUTES = ["/signin", "/signup"];
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
  res.headers.set("Access-Control-Allow-Headers", 
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");

  // Auth redirection
  const url = req.nextUrl.pathname;
  const token = req.cookies.get(TOKEN_COOKIE_NAME)?.value;

  if (token && AUTH_ROUTES.includes(url)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/api/:path*", "/signin", "/signup"],
};  
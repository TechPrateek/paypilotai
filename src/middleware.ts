import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const sessionToken = req.cookies.get("paypilot_session")?.value;
  const isLoggedIn = !!sessionToken;

  const publicPaths = ["/", "/login", "/register"];
  const isPublicPath = publicPaths.some((p) => pathname === p);
  const isApi = pathname.startsWith("/api");

  if (isApi) return NextResponse.next();

  if (!isLoggedIn && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/overview", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.svg).*)"],
};

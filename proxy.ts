import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Simple proxy middleware - no longer handles organization routing
 * Just handles admin access validation
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Landing page is at /
  // Don't redirect - let the homepage render
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Admin routes are handled by the admin layout
  // No special middleware needed

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

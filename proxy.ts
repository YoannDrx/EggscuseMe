import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SiteConfig } from "@/site-config";

/**
 * Proxy for route protection and redirections
 *
 * Current rules:
 * - Redirect logged-in users from "/" to "/fridge" (when enableLandingRedirection is true)
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is logged in via Better Auth session cookie
  // The cookie name follows the pattern: <appId>.session_token
  const sessionCookie = request.cookies.get(
    `${SiteConfig.appId}.session_token`,
  );
  const isLoggedIn = !!sessionCookie?.value;

  // Redirect landing page to /fridge if user is logged in
  if (
    SiteConfig.features.enableLandingRedirection &&
    pathname === "/" &&
    isLoggedIn
  ) {
    return NextResponse.redirect(new URL("/fridge", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*$).*)",
  ],
};

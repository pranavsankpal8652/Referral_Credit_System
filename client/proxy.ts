import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(request: NextRequest) {
  // Get the token from cookies
  const token = request.cookies.get("authToken")?.value;

  // Function to disable middleware caching to ensure fresh cookie reads
  function noCache(response: NextResponse) {
    response.headers.set("x-middleware-cache", "no-cache");
    return response;
  }

  // Define protected routes matcher
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");

  // If route is protected, verify token presence and validity
  if (isProtectedRoute) {
    if (!token) {
      // No token, redirect to login page
      const redirectResponse = NextResponse.redirect(
        new URL("/login", request.url)
      );
      return noCache(redirectResponse);
    }

    try {
      // Validate token
      jwt.verify(token, process.env.JWT_SECRET as string);
      // Token valid, proceed with no-cache header
      return noCache(NextResponse.next());
    } catch (err) {
      // Invalid token, redirect to login
      const redirectResponse = NextResponse.redirect(
        new URL("/login", request.url)
      );
      return noCache(redirectResponse);
    }
  }

  // For non-protected routes, allow request to continue with no-cache
  return noCache(NextResponse.next());
}

export const config = {
  matcher: ["/dashboard/:path*"], // Apply middleware only to /dashboard and sub-paths
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("authToken")?.value || null;
  // console.log("session" + session);
  //   If no session, redirect to login
  if (!session) {
    // console.log("no session");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow request to continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // Protect dashboard and subroutes
};

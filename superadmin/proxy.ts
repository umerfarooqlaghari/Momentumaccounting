import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

// Sends anyone without a session cookie to the login page. The backend still verifies every request.
export function proxy(request: NextRequest) {
  if (!request.cookies.get(SESSION_COOKIE)) {
    const url = new URL("/login", request.url);
    if (request.nextUrl.pathname !== "/") url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // api/backend is excluded: it checks the session itself, and proxy would cap upload bodies at 10 MB.
  matcher: ["/((?!login|api/auth|api/backend|_next/static|_next/image|favicon.ico).*)"],
};

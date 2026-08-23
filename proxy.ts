import { auth } from "@/auth";  
import { NextResponse } from "next/server";

export default auth((req) => {
  const user = req.auth?.user;
  const pathname = req.nextUrl.pathname;

  // Redirect logged-in users away from login
  if (pathname.startsWith("/sign-in") && user) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Admin-only routes
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // Protected user routes
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/login", "/admin/:path*"],
};
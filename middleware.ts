import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const user = req.auth?.user;
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/?signin=required", req.url));
    }

    if ((user as any).role !== "ADMIN") {
      return NextResponse.redirect(new URL("/?error=not-admin", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
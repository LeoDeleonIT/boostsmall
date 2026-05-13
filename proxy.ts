import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  if (pathname.startsWith("/admin")) {
    if (role !== "ADMIN") return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  if (pathname.startsWith("/moderate")) {
    if (role !== "ADMIN" && role !== "MODERATOR") {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }
  // /owner itself is the public "For owners" landing page — only the
  // sub-routes (dashboard, claim, business) need a signed-in session.
  // Trailing slash matters here: matches /owner/anything but not /owner.
  if (pathname.startsWith("/owner/")) {
    if (!req.auth) return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  // Skip static, image, favicon, and Next internals
  matcher: ["/((?!_next/|api/auth|favicon.ico|robots.txt|sitemap.xml).*)"],
};

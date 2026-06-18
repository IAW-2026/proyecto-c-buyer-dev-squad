import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

const isPublicApiRoute = createRouteMatcher([
  "/api/products(.*)",
  "/api/sales",
  "/api/sales/(.*)",
  "/api/admin(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicApiRoute(req)) return;

  if (isAdminRoute(req)) {
    const { sessionClaims } = await auth.protect();
    const metadata = sessionClaims?.metadata as Record<string, unknown> | undefined;
    const role = metadata?.role as string | undefined;
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
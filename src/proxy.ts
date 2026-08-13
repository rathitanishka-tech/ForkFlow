import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, request) => {
  const pathname = request.nextUrl.pathname;
  const isProtectedDashboardApi =
    pathname === "/api/restaurant/current" || pathname.startsWith("/api/tables");

  if (pathname.startsWith("/dashboard") || isProtectedDashboardApi) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/(.*)",
  ],
};

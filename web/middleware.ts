import { NextResponse, type NextRequest } from "next/server";

const protectedPaths = ["/freelancer", "/employer", "/admin", "/onboarding"];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const { pathname } = request.nextUrl;
  
  // Check for auth session cookie (Lucia Auth uses 'auth_session')
  const sessionCookie = request.cookies.get("auth_session");
  const hasSession = !!sessionCookie?.value;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isAuthRoute = pathname.startsWith("/signin") || pathname.startsWith("/signup");

  // Redirect to signin if accessing protected route without session
  if (!hasSession && isProtected) {
    const redirectUrl = new URL("/signin", request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from auth pages
  if (hasSession && isAuthRoute) {
    return NextResponse.redirect(new URL("/freelancer/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/signin", "/signup", "/freelancer/:path*", "/employer/:path*", "/admin/:path*", "/onboarding", "/contracts/:path*"],
};

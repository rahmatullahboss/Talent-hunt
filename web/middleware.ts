import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const protectedPaths = ["/freelancer", "/employer", "/admin", "/onboarding"];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
  }

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get(name) {
        return request.cookies.get(name)?.value;
      },
      set(name, value, options) {
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name, options) {
        response.cookies.set({
          name,
          value: "",
          ...options,
        });
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isAuthRoute = pathname.startsWith("/auth");

  if (!session && isProtected) {
    const redirectUrl = new URL("/auth/signin", request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (session && isAuthRoute && pathname !== "/auth/update-password") {
    const profileRes = await supabase.from("profiles").select("role,onboarding_complete").eq("id", session.user.id).maybeSingle();
    const profile = profileRes.data;

    if (profile?.onboarding_complete === false && pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    if (profile?.role === "freelancer") {
      return NextResponse.redirect(new URL("/freelancer/dashboard", request.url));
    }
    if (profile?.role === "employer") {
      return NextResponse.redirect(new URL("/employer/dashboard", request.url));
    }
    if (profile?.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/auth/:path*", "/freelancer/:path*", "/employer/:path*", "/admin/:path*", "/onboarding", "/contracts/:path*"],
};

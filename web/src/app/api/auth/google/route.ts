import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { getGoogleOAuth } from "@/lib/auth/google";
import { generateCodeVerifier, generateState } from "arctic";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const google = getGoogleOAuth();
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    
    // Get role from query params if present
    const role = request.nextUrl.searchParams.get("role") || "freelancer";
    
    const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"]);
    
    const cookieStore = await cookies();
    
    // Store state and code verifier in cookies
    cookieStore.set("google_oauth_state", state, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10, // 10 minutes
      sameSite: "lax",
    });
    
    cookieStore.set("google_oauth_code_verifier", codeVerifier, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      sameSite: "lax",
    });
    
    cookieStore.set("signup_role", role, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      sameSite: "lax",
    });

    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(new URL("/signin?error=oauth_failed", request.url));
  }
}

import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { generateState, generateCodeVerifier, createGoogleAuthUrl } from "@/lib/auth/google";

export async function GET(request: NextRequest) {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    
    // Get role from query params if present
    const role = request.nextUrl.searchParams.get("role") || "freelancer";
    
    const url = await createGoogleAuthUrl(state, codeVerifier);
    
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";
    
    // Store state and code verifier in cookies
    cookieStore.set("google_oauth_state", state, {
      path: "/",
      httpOnly: true,
      secure: isProduction,
      maxAge: 60 * 10, // 10 minutes
      sameSite: "lax",
    });
    
    cookieStore.set("google_oauth_code_verifier", codeVerifier, {
      path: "/",
      httpOnly: true,
      secure: isProduction,
      maxAge: 60 * 10,
      sameSite: "lax",
    });
    
    cookieStore.set("signup_role", role, {
      path: "/",
      httpOnly: true,
      secure: isProduction,
      maxAge: 60 * 10,
      sameSite: "lax",
    });

    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Google OAuth error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.redirect(new URL(`/signin?error=oauth_failed&message=${encodeURIComponent(errorMessage)}`, request.url));
  }
}

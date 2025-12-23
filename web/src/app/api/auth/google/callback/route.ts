import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { getGoogleOAuth, getGoogleUser } from "@/lib/auth/google";
import { getLucia, getDB } from "@/lib/auth/session";
import { db, generateId } from "@/lib/db";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  
  const storedState = cookieStore.get("google_oauth_state")?.value;
  const storedCodeVerifier = cookieStore.get("google_oauth_code_verifier")?.value;
  const signupRole = cookieStore.get("signup_role")?.value || "freelancer";

  // Clear OAuth cookies
  cookieStore.delete("google_oauth_state");
  cookieStore.delete("google_oauth_code_verifier");
  cookieStore.delete("signup_role");

  if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
    return NextResponse.redirect(new URL("/signin?error=invalid_state", request.url));
  }

  try {
    const google = getGoogleOAuth();
    const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
    const googleUser = await getGoogleUser(tokens.accessToken());

    const lucia = getLucia();
    const d1 = getDB();
    
    if (!lucia || !d1) {
      return NextResponse.redirect(new URL("/signin?error=auth_unavailable", request.url));
    }

    // Check if OAuth account exists
    const existingAccount = await db.getOAuthAccount(d1, "google", googleUser.sub);

    let userId: string;

    if (existingAccount) {
      // Existing user - log them in
      userId = (existingAccount as { user_id: string }).user_id;
    } else {
      // Check if user with this email exists
      const existingUser = await db.getUserByEmail(d1, googleUser.email);

      if (existingUser) {
        // Link OAuth to existing user
        userId = (existingUser as { id: string }).id;
        await db.createOAuthAccount(d1, {
          provider_id: "google",
          provider_user_id: googleUser.sub,
          user_id: userId,
        });
      } else {
        // Create new user
        userId = generateId();
        await db.createUser(d1, {
          id: userId,
          email: googleUser.email,
        });

        // Create profile
        await db.createProfile(d1, {
          id: userId,
          full_name: googleUser.name,
          role: signupRole as "freelancer" | "employer",
        });

        // Link OAuth account
        await db.createOAuthAccount(d1, {
          provider_id: "google",
          provider_user_id: googleUser.sub,
          user_id: userId,
        });
      }
    }

    // Create session
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    // Get profile to determine redirect
    const profile = await db.getProfileById(d1, userId);
    
    if (!profile) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    const profileData = profile as { role: string; onboarding_complete: number };
    
    if (profileData.onboarding_complete === 0) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    const dashboardUrl = profileData.role === "employer" 
      ? "/employer/dashboard" 
      : profileData.role === "admin" 
        ? "/admin/dashboard" 
        : "/freelancer/dashboard";

    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(new URL("/signin?error=callback_failed", request.url));
  }
}

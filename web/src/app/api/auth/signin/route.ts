import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getLucia, getDB } from "@/lib/auth/session";
import { db } from "@/lib/db";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const lucia = getLucia();
    const d1 = getDB();

    if (!lucia || !d1) {
      return NextResponse.json({ error: "Auth not available" }, { status: 500 });
    }

    // Find user by email
    const user = await db.getUserByEmail(d1, email);
    
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const userData = user as { id: string; hashed_password: string | null };

    // For now, simple password comparison (in production, use proper hashing)
    // This is a placeholder - you should use bcrypt or similar
    if (!userData.hashed_password) {
      return NextResponse.json({ error: "Please use Google sign-in for this account" }, { status: 401 });
    }

    // Note: In production, compare hashed passwords properly
    // For MVP, we'll allow OAuth-only login
    if (userData.hashed_password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Create session
    const session = await lucia.createSession(userData.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    
    const cookieStore = await cookies();
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    // Get profile to determine redirect
    const profile = await db.getProfileById(d1, userData.id);
    const profileData = profile as { role: string; onboarding_complete: number } | null;

    let redirect = "/freelancer/dashboard";
    if (!profileData || profileData.onboarding_complete === 0) {
      redirect = "/onboarding";
    } else if (profileData.role === "employer") {
      redirect = "/employer/dashboard";
    } else if (profileData.role === "admin") {
      redirect = "/admin/dashboard";
    }

    return NextResponse.json({ success: true, redirect });
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

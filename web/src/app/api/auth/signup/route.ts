import { NextResponse } from "next/server";
import { getDB } from "@/lib/auth/session";
import { db, generateId } from "@/lib/db";


export async function POST(request: Request) {
  try {
    const { email, password, fullName, role, companyName, bio } = await request.json();

    if (!email || !password || !fullName || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const d1 = getDB();

    if (!d1) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }

    // Check if user already exists
    const existingUser = await db.getUserByEmail(d1, email);
    
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Create user (Note: In production, hash the password!)
    const userId = generateId();
    await db.createUser(d1, {
      id: userId,
      email,
      hashed_password: password, // TODO: Hash this in production
    });

    // Create profile
    await d1
      .prepare(
        `INSERT INTO profiles (id, full_name, role, company_name, bio, onboarding_complete)
         VALUES (?, ?, ?, ?, ?, 0)`
      )
      .bind(userId, fullName, role, companyName || null, bio || null)
      .run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}

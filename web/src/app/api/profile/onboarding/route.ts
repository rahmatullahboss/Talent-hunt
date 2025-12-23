import { NextResponse } from "next/server";
import { getCurrentUser, getDB } from "@/lib/auth/session";
import { toJsonArray } from "@/lib/db";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const auth = await getCurrentUser();
    if (!auth?.user || !auth?.profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDB();
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }

    const body = await request.json();
    const { role, title, bio, skills, hourlyRate, location, website, phone, companyName, hiringNeeds } = body;

    if (role === "freelancer") {
      const skillArray = skills?.split(",").map((s: string) => s.trim()).filter(Boolean) || [];
      
      await db.prepare(`
        UPDATE profiles 
        SET title = ?, bio = ?, skills = ?, hourly_rate = ?, location = ?, website = ?, phone = ?, onboarding_complete = 1, updated_at = datetime('now')
        WHERE id = ?
      `).bind(
        title,
        bio,
        toJsonArray(skillArray),
        hourlyRate ?? null,
        location,
        website ?? null,
        phone ?? null,
        auth.user.id
      ).run();
    } else if (role === "employer") {
      await db.prepare(`
        UPDATE profiles 
        SET title = ?, company_name = ?, bio = ?, location = ?, website = ?, phone = ?, onboarding_complete = 1, updated_at = datetime('now')
        WHERE id = ?
      `).bind(
        title,
        companyName,
        hiringNeeds,
        location,
        website ?? null,
        phone ?? null,
        auth.user.id
      ).run();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}

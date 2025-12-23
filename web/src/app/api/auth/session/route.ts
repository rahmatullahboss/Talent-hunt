import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";

export const runtime = "edge";

export async function GET() {
  try {
    const auth = await getCurrentUser();
    
    if (!auth?.user || !auth?.profile) {
      return NextResponse.json({ user: null, profile: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: auth.user.id,
        email: auth.user.email,
      },
      profile: auth.profile,
    });
  } catch {
    return NextResponse.json({ user: null, profile: null }, { status: 200 });
  }
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getLucia, validateSession } from "@/lib/auth/session";


export async function POST() {
  try {
    const lucia = getLucia();
    if (!lucia) {
      return NextResponse.json({ error: "Auth not available" }, { status: 500 });
    }

    const { session } = await validateSession();
    
    if (session) {
      await lucia.invalidateSession(session.id);
    }

    const sessionCookie = lucia.createBlankSessionCookie();
    const cookieStore = await cookies();
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to sign out" }, { status: 500 });
  }
}

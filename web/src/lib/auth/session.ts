import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { initializeLucia, type Auth } from "./lucia";
import { db, type D1Database } from "@/lib/db";

// Get Cloudflare context (available in Workers environment)
function getCloudflareContext(): { env: { DB: D1Database } } | null {
  // In Cloudflare Workers, context is available via getRequestContext
  // This will be injected by OpenNext.js
  try {
    // @ts-expect-error - Cloudflare specific global
    const ctx = globalThis.__cf_context__;
    return ctx ?? null;
  } catch {
    return null;
  }
}

// Get Lucia instance with D1
export function getLucia(): Auth | null {
  const ctx = getCloudflareContext();
  if (!ctx?.env?.DB) {
    console.warn("D1 database not available");
    return null;
  }
  return initializeLucia(ctx.env.DB);
}

// Get D1 database
export function getDB(): D1Database | null {
  const ctx = getCloudflareContext();
  return ctx?.env?.DB ?? null;
}

// Validate session from cookies
export const validateSession = cache(async () => {
  const lucia = getLucia();
  if (!lucia) {
    return { user: null, session: null };
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return { user: null, session: null };
  }

  const result = await lucia.validateSession(sessionId);

  // Refresh session cookie if needed
  try {
    if (result.session?.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
  } catch {
    // Ignore cookie setting errors in read-only contexts
  }

  return result;
});

// Get current user with profile
export const getCurrentUser = cache(async (): Promise<{ user: NonNullable<Awaited<ReturnType<typeof validateSession>>["user"]>; session: NonNullable<Awaited<ReturnType<typeof validateSession>>["session"]>; profile: Profile } | null> => {
  const { user, session } = await validateSession();

  if (!user || !session) {
    return null;
  }

  const d1 = getDB();
  if (!d1) {
    return null;
  }

  const profile = await db.getProfileById(d1, user.id) as Profile | null;

  if (!profile) {
    return null;
  }

  return {
    user,
    session,
    profile,
  };
});

// Profile type for TypeScript
export interface Profile {
  id: string;
  full_name: string;
  role: "freelancer" | "employer" | "admin";
  avatar_url: string | null;
  title: string | null;
  company_name: string | null;
  bio: string | null;
  hourly_rate: number | null;
  skills: string;
  location: string | null;
  phone: string | null;
  website: string | null;
  onboarding_complete: number;
  is_suspended: number;
  created_at: string;
  updated_at: string;
}

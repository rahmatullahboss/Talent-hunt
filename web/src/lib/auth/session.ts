import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { initializeLucia, type Auth } from "./lucia";
import { db, type D1Database, type ProfileRecord } from "@/lib/db";

// Extended env type with D1
interface CloudflareEnv {
  DB: D1Database;
}

// Re-export ProfileRecord as Profile for backwards compatibility
export type Profile = ProfileRecord;

// Get Lucia instance with D1 - sync version for API routes
export function getLucia(): Auth | null {
  try {
    // Use synchronous getCloudflareContext for API routes
    const { env } = getCloudflareContext();
    const cfEnv = env as unknown as CloudflareEnv;
    if (!cfEnv?.DB) {
      console.warn("D1 database not available");
      return null;
    }
    return initializeLucia(cfEnv.DB);
  } catch (error) {
    console.warn("Failed to get Cloudflare context:", error);
    return null;
  }
}

// Get D1 database - sync version for API routes
export function getDB(): D1Database | null {
  try {
    const { env } = getCloudflareContext();
    const cfEnv = env as unknown as CloudflareEnv;
    return cfEnv?.DB ?? null;
  } catch (error) {
    console.warn("Failed to get D1:", error);
    return null;
  }
}

// Async versions for static routes/top-level usage
export async function getLuciaAsync(): Promise<Auth | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const cfEnv = env as unknown as CloudflareEnv;
    if (!cfEnv?.DB) return null;
    return initializeLucia(cfEnv.DB);
  } catch (error) {
    console.warn("Failed to get Cloudflare context async:", error);
    return null;
  }
}

export async function getDBAsync(): Promise<D1Database | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const cfEnv = env as unknown as CloudflareEnv;
    return cfEnv?.DB ?? null;
  } catch (error) {
    console.warn("Failed to get D1 async:", error);
    return null;
  }
}

// Validate session from cookies (uses async for server components)
export const validateSession = cache(async () => {
  const lucia = await getLuciaAsync();
  if (!lucia) {
    return { user: null, session: null };
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return { user: null, session: null };
  }

  const result = await lucia.validateSession(sessionId);

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
    // Cookie operations may fail - that's okay
  }

  return result;
});

// Get current user with profile (uses async for server components)
export const getCurrentUser = cache(async () => {
  const { user, session } = await validateSession();

  if (!user || !session) {
    return null;
  }

  const d1 = await getDBAsync();
  if (!d1) {
    return { user, session, profile: null };
  }

  const profile = await db.getProfileById(d1, user.id);

  return {
    user,
    session,
    profile,
  };
});

// Logout (invalidate session)
export async function logout() {
  const lucia = getLucia();
  if (!lucia) {
    return;
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value;

  if (sessionId) {
    await lucia.invalidateSession(sessionId);
  }

  const sessionCookie = lucia.createBlankSessionCookie();
  cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}

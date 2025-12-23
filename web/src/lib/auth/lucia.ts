import { Lucia, TimeSpan } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";

// Type for Cloudflare D1 binding
type D1Database = {
  prepare: (query: string) => {
    bind: (...args: unknown[]) => {
      run: () => Promise<{ success: boolean }>;
      first: <T>() => Promise<T | null>;
      all: <T>() => Promise<{ results: T[] }>;
    };
  };
};

// Initialize Lucia with D1 adapter
export function initializeLucia(db: D1Database) {
  const adapter = new D1Adapter(db, {
    user: "users",
    session: "sessions",
  });

  return new Lucia(adapter, {
    sessionExpiresIn: new TimeSpan(30, "d"), // 30 days
    sessionCookie: {
      name: "auth_session",
      expires: false, // session cookies
      attributes: {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    },
    getUserAttributes: (attributes) => {
      return {
        email: attributes.email,
        emailVerified: attributes.email_verified === 1,
      };
    },
  });
}

// Type declarations for Lucia
declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof initializeLucia>;
    DatabaseUserAttributes: {
      email: string;
      email_verified: number;
    };
  }
}

export type Auth = ReturnType<typeof initializeLucia>;

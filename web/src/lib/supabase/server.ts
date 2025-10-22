import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Supabase environment variables are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
}

export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name) {
          const store = await cookieStore;
          return store.get(name)?.value;
        },
        async set(name, value, options: CookieOptions) {
          try {
            const store = await cookieStore;
            store.set?.({
              name,
              value,
              ...options,
            });
          } catch {
            // Ignore errors when called from a Server Component where the cookies instance is read-only
          }
        },
        async remove(name, options: CookieOptions) {
          try {
            const store = await cookieStore;
            store.set?.({
              name,
              value: "",
              ...options,
              maxAge: 0,
            });
          } catch {
            // Ignore errors when called from a Server Component where the cookies instance is read-only
          }
        },
      },
    }
  );
}

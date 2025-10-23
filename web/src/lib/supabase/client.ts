import { createBrowserClient } from "@supabase/ssr";
import { createClient, type SupabaseClientOptions } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Supabase environment variables are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
}

type SupportedFlow = "pkce" | "implicit";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const defaultClientOptions: Pick<SupabaseClientOptions<"public">, "global"> = {
  global: {
    headers: {
      "X-Client-Info": "talenthuntbd-web",
    },
  },
};

export const createSupabaseBrowserClient = (options?: { flowType?: SupportedFlow }) => {
  const flowType = options?.flowType ?? "pkce";

  if (flowType === "pkce") {
    return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, defaultClientOptions);
  }

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    ...defaultClientOptions,
    auth: {
      flowType,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
  });
};

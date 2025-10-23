import { createBrowserClient } from "@supabase/ssr";
import { createClient, type SupabaseClientOptions } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Supabase environment variables are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
}

export type SupportedFlow = "pkce" | "implicit";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const defaultClientOptions: Pick<SupabaseClientOptions<"public">, "global"> = {
  global: {
    headers: {
      "X-Client-Info": "talenthuntbd-web",
    },
  },
};

const MOBILE_USER_AGENT_REGEX = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini|BlackBerry/i;

/**
 * PKCE relies on sessionStorage. Some mobile browsers clear it during the OAuth round-trip,
 * so we fallback to the implicit flow on those devices to keep Google sign-in working.
 */
export const inferSupportedOAuthFlow = (): SupportedFlow => {
  if (typeof window === "undefined") {
    return "pkce";
  }

  const nav = window.navigator as Navigator & { userAgentData?: { mobile?: boolean } };
  const isMobile = Boolean(nav.userAgentData?.mobile) || MOBILE_USER_AGENT_REGEX.test(nav.userAgent ?? "");
  const isStandalonePwa = typeof window.matchMedia === "function" && window.matchMedia("(display-mode: standalone)").matches;

  return isMobile || isStandalonePwa ? "implicit" : "pkce";
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

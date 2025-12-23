// Stub file - Supabase has been replaced with D1
// This file exists for backward compatibility during migration

export function createSupabaseBrowserClient() {
  console.warn("Supabase client is deprecated. Use D1 instead.");
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null }, error: { message: "Use /api/auth/signin instead" } }),
      signInWithOAuth: async () => ({ data: { url: "/api/auth/google" }, error: null }),
      signUp: async () => ({ data: null, error: { message: "Use /api/auth/signup instead" } }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: null, error: null }),
          single: async () => ({ data: null, error: null }),
        }),
      }),
      insert: async () => ({ data: null, error: null }),
      update: async () => ({ data: null, error: null }),
      delete: async () => ({ data: null, error: null }),
    }),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
    channel: () => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
    }),
  };
}

export function inferSupportedOAuthFlow() {
  return "pkce";
}

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      router.replace("/signin");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error, data }) => {
        if (error) {
          toast.error(error.message);
          router.replace("/signin");
          return;
        }
        toast.success("Email confirmed! Let’s finish setting up your profile.");
        if (data.session?.user) {
          router.replace("/onboarding");
        } else {
          router.replace("/signin");
        }
      })
      .catch((error) => {
        toast.error(error.message);
        router.replace("/signin");
      });
  }, [searchParams, router]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden="true" />
      <p className="text-sm text-muted">Confirming your account...</p>
    </div>
  );
}

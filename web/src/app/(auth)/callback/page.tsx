"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type RoleOption = "freelancer" | "employer";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => {
    let isMounted = true;
    const roleParam = searchParams.get("role");
    const normalizedRole: RoleOption | null =
      roleParam === "freelancer" || roleParam === "employer" ? (roleParam as RoleOption) : null;

    const cleanCallbackUrl = () => {
      if (typeof window === "undefined") {
        return;
      }

      const url = new URL(window.location.href);
      ["code", "state", "error", "error_description", "role"].forEach((param) => url.searchParams.delete(param));
      url.hash = "";
      const cleanedSearch = url.searchParams.toString();
      const nextUrl = cleanedSearch ? `${url.pathname}?${cleanedSearch}` : url.pathname;
      router.replace(nextUrl);
    };

    const parseHashParams = () => {
      if (typeof window === "undefined") {
        return null;
      }
      const { hash } = window.location;
      if (!hash || hash.length < 2) {
        return null;
      }
      return new URLSearchParams(hash.slice(1));
    };

    const persistRoleIfNeeded = async (userId: string, desiredRole: RoleOption | null) => {
      if (!desiredRole) {
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

      if (profileError) {
        console.error(profileError);
        toast.error("We couldn't verify your account type. Please try again.");
        return;
      }

      if (profile?.role === desiredRole) {
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ role: desiredRole, onboarding_complete: false })
        .eq("id", userId);

      if (updateError) {
        console.error(updateError);
        toast.error("We couldn't save your account type. Update it from settings after onboarding.");
      }
    };

    const getSuccessRedirect = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/signin");
        return;
      }

      await persistRoleIfNeeded(session.user.id, normalizedRole);
      router.replace("/onboarding");
    };

    const handleAuth = async () => {
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");
      if (error) {
        toast.error(errorDescription ?? "We couldn't continue with that sign-in link. Please try again.");
        router.replace("/signin");
        return;
      }

      const hashParams = parseHashParams();
      if (hashParams) {
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            toast.error(sessionError.message);
            router.replace("/signin");
            return;
          }

          cleanCallbackUrl();
          const type = hashParams.get("type");
          if (type === "recovery") {
            toast.success("Identity confirmed. You can now update your password.");
            router.replace("/update-password");
          } else {
            toast.success("Signed in successfully.");
            await getSuccessRedirect();
          }
          return;
        }
      }

      const {
        data: { session: existingSession },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error(sessionError);
      }

      const successMessage = normalizedRole
        ? "Signed in successfully."
        : "Email confirmed! Let's finish setting up your profile.";

      if (existingSession) {
        cleanCallbackUrl();
        toast.success(successMessage);
        await getSuccessRedirect();
        return;
      }

      const code = searchParams.get("code");
      if (!code) {
        router.replace("/signin");
        return;
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        toast.error(exchangeError.message);
        router.replace("/signin");
        return;
      }

      cleanCallbackUrl();
      toast.success(successMessage);
      await getSuccessRedirect();
    };

    if (isMounted) {
      void handleAuth().catch((error) => {
        toast.error(error.message);
        router.replace("/signin");
      });
    }

    return () => {
      isMounted = false;
    };
  }, [searchParams, router, supabase]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden="true" />
      <p className="text-sm text-muted">Confirming your account...</p>
    </div>
  );
}

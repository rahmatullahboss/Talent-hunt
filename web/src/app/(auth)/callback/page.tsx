"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    
    if (error) {
      toast.error("Authentication failed. Please try again.");
      router.replace("/signin");
      return;
    }

    // For Google OAuth, the callback is now handled by /api/auth/google/callback
    // This page is kept for legacy email confirmation links
    toast.success("Authentication successful!");
    router.replace("/freelancer/dashboard");
  }, [searchParams, router]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden="true" />
      <p className="text-sm text-muted">Confirming your account...</p>
    </div>
  );
}

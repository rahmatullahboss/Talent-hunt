"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8),
  })
  .superRefine((values, ctx) => {
    if (values.password !== values.confirmPassword) {
      ctx.addIssue({ code: "custom", message: "Passwords do not match", path: ["confirmPassword"] });
    }
  });

type FormValues = z.infer<typeof schema>;

export function UpdatePasswordForm() {
  const supabase = useMemo(() => createSupabaseBrowserClient({ flowType: "implicit" }), []);
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const tokenParam = searchParams.get("token");
  const tokenHashParam = searchParams.get("token_hash");
  const typeParam = searchParams.get("type");
  const emailParam = searchParams.get("email");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);

  const resolveEmailOtpType = (candidate?: string | null): "signup" | "invite" | "magiclink" | "recovery" | "email_change" | "email" => {
    switch (candidate) {
      case "signup":
      case "invite":
      case "magiclink":
      case "recovery":
      case "email_change":
      case "email":
        return candidate;
      default:
        return "recovery";
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isSessionReady) {
      return;
    }

    let isMounted = true;

    const cleanAuthParams = () => {
      if (typeof window === "undefined") {
        return;
      }

      const currentUrl = new URL(window.location.href);
      ["code", "token", "token_hash", "type", "error", "error_code", "error_description"].forEach((param) => {
        currentUrl.searchParams.delete(param);
      });
      currentUrl.hash = "";
      const cleanedSearch = currentUrl.searchParams.toString();
      const cleanPath = cleanedSearch ? `${currentUrl.pathname}?${cleanedSearch}` : currentUrl.pathname;
      router.replace(cleanPath);
    };

    const getHashParams = () => {
      if (typeof window === "undefined") {
        return null;
      }
      const hash = window.location.hash;
      if (!hash || hash.length < 2) {
        return null;
      }
      return new URLSearchParams(hash.slice(1));
    };

    const trySetSessionFromHash = async () => {
      const hashParams = getHashParams();
      if (!hashParams) {
        return false;
      }

      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (accessToken && refreshToken) {
        const { error: setSessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (setSessionError) {
          toast.error(setSessionError.message);
          router.replace("/signin");
          return true;
        }

        if (isMounted) {
          setIsSessionReady(true);
        }
        cleanAuthParams();
        return true;
      }

      const hashTokenHash = hashParams.get("token_hash");
      const hashType = resolveEmailOtpType(hashParams.get("type") ?? typeParam);

      if (hashTokenHash) {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          type: hashType,
          token_hash: hashTokenHash,
        });

        if (verifyError) {
          toast.error(verifyError.message);
          router.replace("/reset-password");
          return true;
        }

        if (isMounted) {
          setIsSessionReady(true);
        }
        cleanAuthParams();
        return true;
      }

      const hashOtpToken = hashParams.get("token");
      const hashEmail = hashParams.get("email");

      if (hashOtpToken && hashEmail) {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          type: hashType,
          token: hashOtpToken,
          email: hashEmail,
        });

        if (verifyError) {
          toast.error(verifyError.message);
          router.replace("/reset-password");
          return true;
        }

        if (isMounted) {
          setIsSessionReady(true);
        }
        cleanAuthParams();
        return true;
      }

      return false;
    };

    async function prepareSession() {
      if (error) {
        toast.error(errorDescription ?? "The reset link is invalid or has expired. Please request a new one.");
        router.replace("/reset-password");
        return;
      }

      if (await trySetSessionFromHash()) {
        return;
      }

      if (tokenHashParam) {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          type: resolveEmailOtpType(typeParam),
          token_hash: tokenHashParam,
        });

        if (verifyError) {
          toast.error(verifyError.message);
          router.replace("/reset-password");
          return;
        }

        if (isMounted) {
          setIsSessionReady(true);
        }
        cleanAuthParams();
        return;
      }

      if (tokenParam) {
        if (!emailParam) {
          toast.error("The reset link is missing your email address. Request a new password reset.");
          router.replace("/reset-password");
          return;
        }

        const { error: verifyError } = await supabase.auth.verifyOtp({
          type: resolveEmailOtpType(typeParam),
          token: tokenParam,
          email: emailParam,
        });

        if (verifyError) {
          toast.error(verifyError.message);
          router.replace("/reset-password");
          return;
        }

        if (isMounted) {
          setIsSessionReady(true);
        }
        cleanAuthParams();
        return;
      }

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          toast.error(exchangeError.message);
          router.replace("/signin");
          return;
        }
        if (isMounted) {
          setIsSessionReady(true);
        }
        cleanAuthParams();
        return;
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        toast.error("Your password reset session has expired. Request a new reset email to continue.");
        router.replace("/reset-password");
        return;
      }

      if (isMounted) {
        setIsSessionReady(true);
      }
    }

    void prepareSession();

    return () => {
      isMounted = false;
    };
  }, [code, emailParam, error, errorDescription, supabase, router, tokenHashParam, tokenParam, typeParam, isSessionReady]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Password updated. You can now log in with your new credentials.");
    router.push("/signin");
    setLoading(false);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-muted" htmlFor="password">
          New password
        </label>
        <Input id="password" type="password" placeholder="Enter a strong password" {...register("password")} disabled={!isSessionReady} />
        {errors.password ? <p className="text-sm text-red-500">{errors.password.message}</p> : null}
      </div>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-muted" htmlFor="confirmPassword">
          Confirm new password
        </label>
        <Input id="confirmPassword" type="password" placeholder="Confirm the password" {...register("confirmPassword")} disabled={!isSessionReady} />
        {errors.confirmPassword ? <p className="text-sm text-red-500">{errors.confirmPassword.message}</p> : null}
      </div>
      <Button type="submit" className="w-full" loading={loading} disabled={!isSessionReady}>
        Update password
      </Button>
    </form>
  );
}

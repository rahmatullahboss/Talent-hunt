"use client";

import { useEffect, useState } from "react";
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
  const supabase = createSupabaseBrowserClient();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    let isMounted = true;

    async function prepareSession() {
      if (error) {
        toast.error(errorDescription ?? "The reset link is invalid or has expired. Please request a new one.");
        router.replace("/reset-password");
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
  }, [code, error, errorDescription, supabase, router]);

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

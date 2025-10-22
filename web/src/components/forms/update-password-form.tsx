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
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(() => !code);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!code) {
      return;
    }

    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) {
          toast.error(error.message);
          router.replace("/auth/signin");
          return;
        }
        setIsSessionReady(true);
      })
      .catch((error) => {
        toast.error(error.message);
        router.replace("/auth/signin");
      });
  }, [code, supabase, router]);

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
    router.push("/auth/signin");
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

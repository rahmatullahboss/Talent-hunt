"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().email("Enter the email you used to sign up"),
});

type FormValues = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://talenthuntbd.vercel.app");
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${siteUrl}/update-password`,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Check your email for a password reset link.");
    setLoading(false);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-muted" htmlFor="email">
          Email address
        </label>
        <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register("email")} />
        {errors.email ? <p className="text-sm text-red-500">{errors.email.message}</p> : null}
      </div>
      <Button type="submit" className="w-full" loading={loading}>
        Send reset link
      </Button>
    </form>
  );
}

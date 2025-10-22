"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();

    const { error, data } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      toast.error("We could not find your account. Please try again.");
      setLoading(false);
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role, onboarding_complete")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError) {
      toast.error(profileError.message);
      setLoading(false);
      return;
    }

    toast.success("Welcome back!");

    if (redirectTo) {
      router.push(redirectTo);
    } else if (profileData?.onboarding_complete === false) {
      router.push("/onboarding");
    } else {
      switch (profileData?.role) {
        case "employer":
          router.push("/employer/dashboard");
          break;
        case "freelancer":
          router.push("/freelancer/dashboard");
          break;
        case "admin":
          router.push("/admin/dashboard");
          break;
        default:
          router.push("/onboarding");
      }
    }

    router.refresh();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-muted" htmlFor="email">
          Email address
        </label>
        <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register("email")} />
        {errors.email ? <p className="text-sm text-red-500">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-muted" htmlFor="password">
          Password
        </label>
        <Input id="password" type="password" placeholder="Enter your password" autoComplete="current-password" {...register("password")} />
        {errors.password ? <p className="text-sm text-red-500">{errors.password.message}</p> : null}
      </div>

      <Button type="submit" className="w-full" loading={loading}>
        Log in
      </Button>
    </form>
  );
}

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
import { getNormalizedSiteUrl } from "@/lib/site-url";
import { GoogleIcon } from "@/components/icons/google";

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
  const [oauthLoading, setOauthLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const handleGoogleSignIn = async () => {
    setOauthLoading(true);
    const supabase = createSupabaseBrowserClient();
    const normalizedSiteUrl = getNormalizedSiteUrl();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${normalizedSiteUrl}/callback`,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      toast.error(error.message);
      setOauthLoading(false);
      return;
    }

    if (data?.url) {
      window.location.href = data.url;
      return;
    }

    setOauthLoading(false);
  };

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
    <div className="space-y-6">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-center gap-3"
        loading={oauthLoading}
        onClick={handleGoogleSignIn}
      >
        <span className="flex items-center justify-center gap-3 text-sm font-medium">
          <GoogleIcon className="h-4 w-4 shrink-0" />
          Continue with Google
        </span>
      </Button>
      <div className="flex items-center gap-3 text-xs font-medium uppercase text-muted/70">
        <span className="h-px flex-1 bg-card-border" />
        <span>or</span>
        <span className="h-px flex-1 bg-card-border" />
      </div>
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
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Please enter your full name"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8),
    role: z.enum(["freelancer", "employer"]),
    companyName: z.string().optional(),
    shortBio: z.string().max(240, "Keep your introduction under 240 characters").optional(),
  })
  .superRefine((values, ctx) => {
    if (values.password !== values.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }

    if (values.role === "employer" && !values.companyName?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Company name is required for employers",
        path: ["companyName"],
      });
    }
  });

type FormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetRole = searchParams.get("role") === "employer" ? "employer" : searchParams.get("role") === "freelancer" ? "freelancer" : undefined;
  const [loading, setLoading] = useState(false);
  const supabase = createSupabaseBrowserClient();
  const initialRole: FormValues["role"] = presetRole ?? "freelancer";
  const [role, setRole] = useState<FormValues["role"]>(initialRole);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: initialRole,
      companyName: "",
      shortBio: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
        data: {
          full_name: values.fullName,
          role: values.role,
          company_name: values.role === "employer" ? values.companyName : undefined,
          short_bio: values.shortBio,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    const requiresEmailConfirmation = !data.session;

    if (requiresEmailConfirmation) {
      toast.success("Account created! Please check your inbox to verify your email before logging in.");
    } else {
      toast.success("Account created! Let’s complete your onboarding.");
    }

    router.push("/auth/signin");
    setLoading(false);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-muted" htmlFor="fullName">
          Full name
        </label>
        <Input id="fullName" placeholder="Your full name" autoComplete="name" {...register("fullName")} />
        {errors.fullName ? <p className="text-sm text-red-500">{errors.fullName.message}</p> : null}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-muted" htmlFor="email">
            Email address
          </label>
          <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register("email")} />
          {errors.email ? <p className="text-sm text-red-500">{errors.email.message}</p> : null}
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-muted" htmlFor="role">
            I am signing up as
          </label>
          <input type="hidden" {...register("role")} />
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "freelancer" as const, label: "Freelancer", description: "Offer services & build portfolio" },
              { value: "employer" as const, label: "Employer", description: "Post jobs & hire talent" },
            ].map((option) => (
              <button
                type="button"
                key={option.value}
                className={cn(
                  "rounded-[var(--radius-md)] border px-4 py-3 text-left text-sm transition",
                  role === option.value ? "border-accent bg-accent/10 text-accent" : "border-card-border text-muted",
                )}
                onClick={() => {
                  setRole(option.value);
                  setValue("role", option.value, { shouldDirty: true, shouldValidate: true });
                }}
                aria-pressed={role === option.value}
              >
                <span className="block font-semibold">{option.label}</span>
                <span className="mt-1 block text-xs text-muted">{option.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-muted" htmlFor="password">
            Password
          </label>
          <Input id="password" type="password" placeholder="Create a password" autoComplete="new-password" {...register("password")} />
          {errors.password ? <p className="text-sm text-red-500">{errors.password.message}</p> : null}
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-muted" htmlFor="confirmPassword">
            Confirm password
          </label>
          <Input id="confirmPassword" type="password" placeholder="Confirm password" autoComplete="new-password" {...register("confirmPassword")} />
          {errors.confirmPassword ? <p className="text-sm text-red-500">{errors.confirmPassword.message}</p> : null}
        </div>
      </div>

      {role === "employer" ? (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-muted" htmlFor="companyName">
            Company name
          </label>
          <Input id="companyName" placeholder="Registered company name" {...register("companyName")} />
          {errors.companyName ? <p className="text-sm text-red-500">{errors.companyName.message}</p> : null}
        </div>
      ) : null}

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-muted" htmlFor="shortBio">
          Short introduction (optional)
        </label>
        <Textarea id="shortBio" rows={3} placeholder="Tell us a bit about your expertise or the type of projects you're hiring for." {...register("shortBio")} />
        {errors.shortBio ? <p className="text-sm text-red-500">{errors.shortBio.message}</p> : null}
      </div>

      <Button type="submit" className="w-full" loading={loading}>
        Create account
      </Button>
    </form>
  );
}

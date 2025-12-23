"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send reset email");
      }

      toast.success("Check your email for a password reset link.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send reset email";
      toast.error(message);
    } finally {
      setLoading(false);
    }
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

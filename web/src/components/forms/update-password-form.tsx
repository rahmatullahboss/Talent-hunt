"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: values.password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update password");
      }

      toast.success("Password updated. You can now log in with your new credentials.");
      router.push("/signin");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-muted" htmlFor="password">
          New password
        </label>
        <Input id="password" type="password" placeholder="Enter a strong password" {...register("password")} />
        {errors.password ? <p className="text-sm text-red-500">{errors.password.message}</p> : null}
      </div>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-muted" htmlFor="confirmPassword">
          Confirm new password
        </label>
        <Input id="confirmPassword" type="password" placeholder="Confirm the password" {...register("confirmPassword")} />
        {errors.confirmPassword ? <p className="text-sm text-red-500">{errors.confirmPassword.message}</p> : null}
      </div>
      <Button type="submit" className="w-full" loading={loading}>
        Update password
      </Button>
    </form>
  );
}

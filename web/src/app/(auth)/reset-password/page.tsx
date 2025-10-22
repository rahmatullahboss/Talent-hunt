import type { Metadata } from "next";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Request a password reset link for your TalentHunt BD account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold leading-tight text-foreground">Reset your password</h1>
        <p className="mt-2 text-sm text-muted">We&apos;ll email you a secure link to update your password.</p>
      </div>
      <ResetPasswordForm />
      <p className="text-sm text-muted">
        Remembered your password?{" "}
        <Link href="/signin" className="text-accent hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}

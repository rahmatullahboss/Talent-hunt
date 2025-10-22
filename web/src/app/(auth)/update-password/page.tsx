import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/forms/update-password-form";

export const metadata: Metadata = {
  title: "Set a new password",
  description: "Securely update your password.",
};

export default function UpdatePasswordPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold leading-tight text-foreground">Choose a new password</h1>
        <p className="mt-2 text-sm text-muted">Enter a strong, unique password to keep your account secure.</p>
      </div>
      <UpdatePasswordForm />
    </div>
  );
}

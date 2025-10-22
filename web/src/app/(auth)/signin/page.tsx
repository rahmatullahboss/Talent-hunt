import type { Metadata } from "next";
import Link from "next/link";
import { SignInForm } from "@/components/forms/sign-in-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Access your TalentHunt BD account.",
};

export default function SignInPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold leading-tight text-foreground">Welcome back</h1>
        <p className="mt-2 text-sm text-muted">Log in to manage your projects, proposals, and payouts.</p>
      </div>
      <SignInForm />
      <div className="flex flex-col gap-2 text-sm text-muted">
        <Link href="/reset-password" className="text-accent hover:underline">
          Forgot your password?
        </Link>
        <p>
          New to TalentHunt BD?{" "}
          <Link href="/signup" className="text-accent hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/components/forms/sign-up-form";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Join TalentHunt BD as a freelancer or employer.",
};

export default function SignUpPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold leading-tight text-foreground">Create your TalentHunt BD account</h1>
        <p className="mt-2 text-sm text-muted">
          Tell us a little about yourself to tailor the experience to your goals.
        </p>
      </div>
      <SignUpForm />
      <p className="text-sm text-muted">
        Already have an account?{" "}
        <Link href="/signin" className="text-accent hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

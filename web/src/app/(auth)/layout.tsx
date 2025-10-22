import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: {
    template: "%s | TalentHunt BD",
    default: "Access your account",
  },
};

const highlights = [
  {
    title: "Instant project recommendations",
    description: "Discover briefings curated to your skills and goals the moment you sign in.",
  },
  {
    title: "Escrow-backed milestones",
    description: "Collaborate with confidence knowing payments are protected until work is approved.",
  },
  {
    title: "Local support, global reach",
    description: "A Dhaka-based team helps you connect with teams across Bangladesh and worldwide.",
  },
];

const stats = [
  { value: "12K+", label: "Verified Bangladeshi specialists" },
  { value: "4.9/5", label: "Average client satisfaction" },
  { value: "48h", label: "Time to shortlist talent" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f2f7f2] text-[#001e00]">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-8 rounded-[32px] bg-white/90 p-10 shadow-[0_24px_64px_rgba(0,30,0,0.08)]">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 text-2xl font-semibold tracking-tight text-[#001e00]"
          >
            TalentHunt
            <span className="rounded-full bg-[#ecf8ec] px-3 py-1 text-sm font-medium uppercase tracking-wide text-accent">
              BD
            </span>
          </Link>
          <div className="rounded-[24px] border border-[#cde7cd] bg-white/95 p-8 shadow-[0_16px_36px_rgba(0,30,0,0.08)]">
            {children}
          </div>
          <div className="rounded-[24px] bg-[#f5faf5] p-6 text-sm text-[#335c3b] shadow-inner">
            <p className="text-base font-semibold text-[#001e00]">Need a hand?</p>
            <p>
              Our Dhaka-based support team is here for you at{" "}
              <a href="mailto:support@talenthunt.bd" className="font-medium text-accent underline-offset-2 hover:underline">
                support@talenthunt.bd
              </a>
              .
            </p>
            <p>
              Secure login and two-factor ready authentication keep your projects and payouts protected.
            </p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[32px] border border-[#cde7cd] bg-gradient-to-br from-[#ecf8ec] via-white to-[#dff4df] p-10 shadow-[0_24px_64px_rgba(0,30,0,0.06)]">
          <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-[#c1f2c1]/60 blur-3xl" aria-hidden />
          <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-[#c1f2c1]/40 blur-3xl" aria-hidden />
          <div className="relative flex h-full flex-col gap-10">
            <div className="space-y-5">
              <Badge className="w-fit bg-[#dff4df] text-accent">Why TalentHunt BD</Badge>
              <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                Built for the next generation of Bangladeshi professionals
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-[#335c3b]">
                Join a curated community of experts, explore hand-picked projects, and grow your career with trusted local support.
              </p>
            </div>
            <div className="space-y-4">
              {highlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="flex items-start gap-3 rounded-2xl border border-[#cde7cd]/70 bg-white/75 p-5 shadow-sm"
                >
                  <CheckCircle2 className="mt-1 h-5 w-5 text-accent" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#001e00]">{highlight.title}</p>
                    <p className="text-sm text-[#335c3b]">{highlight.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto grid gap-4 text-sm text-[#335c3b] sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/70 p-4 text-center shadow-sm">
                  <p className="text-2xl font-semibold text-[#001e00]">{stat.value}</p>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

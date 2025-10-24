import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  CircleDollarSign,
  Globe2,
  Layers,
  Lightbulb,
  LineChart,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  verification: {
    google: "google8e80767e6782e05e.html",
  },
};

const heroStats = [
  { value: "12K+", label: "Bangladeshi freelancers" },
  { value: "4.9/5", label: "Average client rating" },
  { value: "48h", label: "Average time to shortlist" },
];

const categories = [
  {
    title: "Development & IT",
    description: "Full-stack, mobile, DevOps, QA",
    icon: Sparkles,
  },
  {
    title: "Design & Creative",
    description: "Product, brand, UI motion, 3D",
    icon: Lightbulb,
  },
  {
    title: "Marketing & Growth",
    description: "Performance, automation, CRM",
    icon: LineChart,
  },
  {
    title: "Finance & Admin",
    description: "Accounting, HR, virtual support",
    icon: UsersRound,
  },
  {
    title: "Product & Project",
    description: "Product ops, PMs, scrum masters",
    icon: Briefcase,
  },
  {
    title: "Video & Content",
    description: "Scriptwriting, editing, localization",
    icon: Building2,
  },
];

const proofPoints = [
  {
    title: "Talent verified with care",
    description:
      "Each profile is screened for experience, communication, and delivery so you meet professionals ready to work now.",
    icon: ShieldCheck,
  },
  {
    title: "Managed payments",
    description:
      "Escrow, invoicing, and transparent reports give you peace of mind from kickoff to final delivery.",
    icon: CircleDollarSign,
  },
  {
    title: "Scale without limits",
    description:
      "Tap into specialists across Bangladesh and collaborate seamlessly with teams in any timezone.",
    icon: Globe2,
  },
];

const workflow = [
  {
    title: "Share what you need",
    description:
      "Publish a job or browse curated projects. Our smart brief builder makes it simple to describe scope, budget, and goals.",
    icon: Layers,
  },
  {
    title: "Review matched talent",
    description:
      "Receive ready-to-interview freelancers within 48 hours, complete with portfolios, ratings, and rate guidance.",
    icon: BadgeCheck,
  },
  {
    title: "Launch with support",
    description:
      "Kick off with protected payments, milestone tracking, and a local success team on standby whenever you need help.",
    icon: Rocket,
  },
];

const testimonials = [
  {
    quote:
      "TalentHunt helped us assemble a full product pod in under two weeks. The hiring experience feels like Upwork, but hyper-focused on our market.",
    name: "Anika Rahman",
    role: "Head of Product, Chaldal",
  },
  {
    quote:
      "From motion designers to QA leads, every freelancer we met was vetted and professional. We now source 80% of our talent here.",
    name: "Farhan Chowdhury",
    role: "Operations Lead, Daraz",
  },
  {
    quote:
      "The protected contracts and local billing make remote work stress-free for both sides. It’s my go-to for scaling teams.",
    name: "Jubayer Hasan",
    role: "Founder, Shape Studio",
  },
];

const trustedBy = ["Pathao", "ShopUp", "bKash", "iFarmer", "Shikho", "TallyKhata"];

export default function Home() {
  return (
    <div className="min-h-screen text-foreground">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-24 px-6 pb-24 pt-12">
        <section
          id="marketplace"
          className="grid gap-12 rounded-[32px] bg-white/90 p-10 shadow-[0_24px_64px_rgba(0,30,0,0.08)] lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="space-y-8">
            <Badge className="w-fit bg-accent/15 text-accent">Bangladesh’s Upwork-style marketplace</Badge>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Hire Bangladeshi specialists trusted by global teams.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted md:text-xl">
              Match instantly with vetted developers, designers, marketers, and operators. Post jobs for free, interview top
              freelancers, and launch projects with confidence backed by escrow protection.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signup?role=employer">
                  Post a job for free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="secondary" asChild size="lg">
                <Link href="/talent">Browse freelancers</Link>
              </Button>
            </div>
            <div className="grid gap-6 text-sm text-muted sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="space-y-1 rounded-2xl bg-foreground/5 p-4 shadow-sm">
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
              <span className="font-semibold text-foreground">Trusted by</span>
              {trustedBy.map((brand) => (
                <span key={brand} className="rounded-full bg-accent/10 px-4 py-1 text-xs font-medium uppercase tracking-wide">
                  {brand}
                </span>
              ))}
            </div>
          </div>
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-[#f0fff0] via-white to-[#dff4df] p-8 shadow-none">
            <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[#c1f2c1]/40 blur-3xl" aria-hidden />
            <div className="relative space-y-6">
              <div className="rounded-3xl bg-white/90 p-6 shadow-[0_20px_40px_rgba(0,30,0,0.1)]">
                <div className="flex items-center justify-between text-xs font-medium text-muted">
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" /> Senior Product Designer
                  </span>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-accent">৳ 90,000/mo</span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-muted">
                  <p>Figma · Design systems · Motion</p>
                  <div className="flex items-center gap-2 text-xs text-muted/90">
                    <Star className="h-4 w-4 fill-accent text-accent" /> 5.0 (64 reviews)
                  </div>
                </div>
              </div>
              <div className="rounded-3xl bg-white/90 p-6 shadow-[0_20px_40px_rgba(0,30,0,0.08)]">
                <p className="text-sm font-medium text-foreground">&ldquo;TalentHunt replaced three weeks of sourcing with one call.&rdquo;</p>
                <p className="mt-4 text-xs text-muted">— Ahsan Karim, SaaS Founder</p>
              </div>
              <div className="flex items-center gap-4 rounded-3xl bg-white/90 p-4 shadow-[0_12px_24px_rgba(0,30,0,0.05)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                  ZH
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Zara Haque</p>
                  <p className="text-xs text-muted">Top Rated Plus · UI/UX</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section id="why-talenthunt" className="space-y-12">
          <header className="space-y-4 text-center">
            <Badge className="mx-auto bg-accent/15 text-accent">Why teams choose TalentHunt</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Everything you expect from Upwork, tailored for Bangladesh</h2>
            <p className="mx-auto max-w-3xl text-lg text-muted">
              We pair global-quality marketplace features with localized payment support, curated talent pools, and a success
              team that understands your market.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {proofPoints.map((item) => (
              <Card key={item.title} className="h-full space-y-4 border border-card-border bg-white/90 p-6 shadow-sm">
                <item.icon className="h-10 w-10 text-accent" />
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted">{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-12 rounded-[32px] bg-white/90 p-10 shadow-[0_20px_48px_rgba(0,30,0,0.06)] md:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <Badge className="bg-accent/15 text-accent">How it works</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Launch your next project in three easy steps</h2>
            <p className="text-lg text-muted">
              Whether you need a single specialist or a full squad, TalentHunt mirrors the Upwork experience with a local touch.
            </p>
            <Button asChild size="lg" className="mt-4 w-fit">
              <Link href="/signup?role=employer">Create a client account</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {workflow.map((step, index) => (
              <Card key={step.title} className="flex items-start gap-4 border border-card-border bg-white/95 p-5 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold text-accent">
                  {index + 1}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <step.icon className="h-5 w-5 text-accent" />
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted">{step.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-10">
          <header className="space-y-4 text-center">
            <Badge className="mx-auto bg-accent/15 text-accent">Browse top skills</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Hire specialists across every discipline</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              Discover Upwork-quality talent without the global search. Every freelancer speaks your language—literally and figuratively.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.title} className="h-full space-y-3 border border-card-border bg-white/90 p-6 shadow-sm">
                <category.icon className="h-8 w-8 text-accent" />
                <h3 className="text-lg font-semibold">{category.title}</h3>
                <p className="text-sm text-muted">{category.description}</p>
                <Button asChild variant="link" className="h-auto px-0 text-accent">
                  <Link href="/talent">Meet freelancers</Link>
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-10 rounded-[32px] bg-white/90 p-10 shadow-[0_20px_48px_rgba(0,30,0,0.06)] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <Badge className="bg-accent/15 text-accent">Proof from local leaders</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Teams across Bangladesh rely on TalentHunt</h2>
            <p className="text-lg text-muted">
              Hear from companies and founders who build distributed teams using a platform that feels like Upwork, but is built
              for Bangladesh.
            </p>
            <Button asChild size="lg" variant="secondary" className="bg-card text-foreground shadow-sm">
              <Link href="/talent">Start browsing freelancers</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="space-y-3 border border-card-border bg-white/95 p-6 shadow-sm">
                <p className="text-sm text-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {testimonial.name}
                </div>
                <p className="text-xs text-muted">{testimonial.role}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-transparent bg-gradient-to-r from-[#dff4df] via-[#b9ebc0] to-[#f0fff0] p-10 text-center shadow-[0_20px_48px_rgba(0,30,0,0.06)]">
          <div className="mx-auto max-w-3xl space-y-4">
            <h2 className="text-3xl font-semibold md:text-4xl">Ready to hire with an Upwork-level experience?</h2>
            <p className="text-lg text-muted">
              Create a free employer profile, share your brief, and meet Bangladesh’s top freelancers within days.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/signup?role=employer">Get started</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="bg-card text-foreground shadow-sm">
                <Link href="/talent">Explore freelancers</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

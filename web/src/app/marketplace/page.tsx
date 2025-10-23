import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CircleDollarSign,
  Globe,
  Layers,
  LineChart,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const heroStats = [
  { value: "12K+", label: "Bangladeshi independents" },
  { value: "4.9/5", label: "Average contract rating" },
  { value: "48h", label: "Typical shortlist speed" },
];

const categories = [
  {
    title: "Product & Engineering",
    description: "Full-stack, mobile, QA, DevOps experts",
    icon: Sparkles,
  },
  {
    title: "Design & Creative",
    description: "Product designers, illustrators, motion",
    icon: Star,
  },
  {
    title: "Growth & Marketing",
    description: "Lifecycle, performance, CRM specialists",
    icon: LineChart,
  },
  {
    title: "Operations & Support",
    description: "Project managers, finance, virtual assistants",
    icon: UsersRound,
  },
  {
    title: "Content & Media",
    description: "Writers, video editors, localization",
    icon: Layers,
  },
  {
    title: "Data & Analytics",
    description: "BI, data science, automation pros",
    icon: Globe,
  },
];

const differentiators = [
  {
    title: "Upwork-style experience, local edge",
    description:
      "Search, filter, and invite talent with the familiar tools you know, plus Bangladeshi pricing, compliance, and support.",
    icon: ShieldCheck,
  },
  {
    title: "Vetted profiles only",
    description:
      "Every freelancer is screened for delivery history, communication, and domain expertise before appearing in search.",
    icon: BadgeCheck,
  },
  {
    title: "Protected payments & milestones",
    description:
      "Escrow-backed contracts, automated invoicing, and transparent reporting keep your engagements on track.",
    icon: CircleDollarSign,
  },
];

const testimonials = [
  {
    quote:
      "We filled a senior product designer role without leaving TalentHunt BD. The curation and support beats every other marketplace we've tried.",
    name: "Nafisa Ahmed",
    role: "Head of Design, ShopUp",
  },
  {
    quote:
      "Their talent pool is world-class. We hired a remote growth pod in under a week, complete with clear milestones and budgets.",
    name: "Sakib Rahman",
    role: "Founder, Pally",
  },
  {
    quote:
      "Global-ready processes, local insight. Payments, contracts, and replacements are handled faster than any global platform.",
    name: "Rafiul Islam",
    role: "COO, Sheba.xyz",
  },
];

const workflow = [
  {
    title: "Post a job or search",
    description:
      "Start with a brief or browse the marketplace. Filters mirror Upwork so you can zero in on skills, rates, and availability.",
    icon: Layers,
  },
  {
    title: "Review and invite",
    description:
      "Compare curated matches, message freelancers, and send invites or offers directly from their profiles.",
    icon: ArrowRight,
  },
  {
    title: "Launch with support",
    description:
      "Kick off with milestone tracking, escrow protection, and a success partner ready to assist whenever you need help.",
    icon: Rocket,
  },
];

export default function MarketplacePage() {
  return (
    <div className="min-h-screen text-foreground">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-24 pt-16">
        <header className="grid gap-12 rounded-[32px] bg-white/90 p-10 shadow-[0_24px_64px_rgba(0,30,0,0.08)] md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div className="space-y-6">
            <Badge className="w-fit bg-accent/15 text-accent">Talent marketplace</Badge>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Discover Bangladesh&apos;s top independents ready for your next sprint.
            </h1>
            <p className="text-lg text-muted">
              Search vetted profiles, invite Top Rated experts, and collaborate with confidence thanks to escrow protection and local success managers.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signup?role=employer">
                  Post a job for free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="bg-card text-foreground shadow-sm">
                <Link href="/talent">For freelancers</Link>
              </Button>
            </div>
            <div className="grid gap-4 text-sm text-muted sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-foreground/5 p-4 text-center shadow-sm">
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <Card className="space-y-6 border border-card-border bg-white/95 p-6 shadow-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground" htmlFor="marketplace-search">
                  Search for a skill or role
                </label>
                <div className="rounded-2xl border border-card-border bg-foreground/5 p-4 text-sm text-muted">
                  Try “Full-stack engineer”, “Brand strategist”, or “Motion designer”
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted/80">Spotlight services</p>
                <div className="grid gap-3">
                  <div className="rounded-2xl border border-card-border bg-white p-4">
                    <p className="text-sm font-semibold text-foreground">Product Design Sprint</p>
                    <p className="text-xs text-muted">৳ 85,000 · 2 weeks · UI/UX, prototyping, handoff</p>
                  </div>
                  <div className="rounded-2xl border border-card-border bg-white p-4">
                    <p className="text-sm font-semibold text-foreground">Growth Experiment Squad</p>
                    <p className="text-xs text-muted">৳ 120,000 · 4 weeks · Paid social, CRO, analytics</p>
                  </div>
                  <div className="rounded-2xl border border-card-border bg-white p-4">
                    <p className="text-sm font-semibold text-foreground">Automation & AI Audit</p>
                    <p className="text-xs text-muted">৳ 70,000 · 10 days · Workflow automation, AI tooling</p>
                  </div>
                </div>
              </div>
            </div>
            <Button asChild size="lg" className="w-full">
              <Link href="/signup?role=employer">Browse full marketplace</Link>
            </Button>
          </Card>
        </header>

        <section className="space-y-10">
          <header className="space-y-4 text-center">
            <Badge className="mx-auto bg-accent/15 text-accent">Top categories</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Start with proven Bangladeshi specialists</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              Explore curated categories that mirror Upwork&apos;s marketplace while spotlighting homegrown talent ready for global teams.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.title} className="h-full space-y-3 border border-card-border bg-white/90 p-6 shadow-sm">
                <category.icon className="h-8 w-8 text-accent" />
                <h3 className="text-lg font-semibold">{category.title}</h3>
                <p className="text-sm text-muted">{category.description}</p>
                <Button asChild variant="link" className="h-auto px-0 text-accent">
                  <Link href="/signup?role=employer">View available talent</Link>
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-10 rounded-[32px] bg-white/90 p-10 shadow-[0_20px_48px_rgba(0,30,0,0.06)] md:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <Badge className="bg-accent/15 text-accent">Why teams hire here</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Marketplace confidence with concierge care</h2>
            <p className="text-lg text-muted">
              Built by talent operators who understand the Bangladeshi ecosystem, TalentHunt BD combines marketplace flexibility with white-glove support.
            </p>
          </div>
          <div className="space-y-4">
            {differentiators.map((item) => (
              <Card key={item.title} className="flex items-start gap-4 border border-card-border bg-white/95 p-5 shadow-sm">
                <item.icon className="mt-1 h-6 w-6 text-accent" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-10">
          <header className="space-y-4 text-center">
            <Badge className="mx-auto bg-accent/15 text-accent">How it works</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Launch projects in days, not weeks</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              From posting to payment, every step mirrors global standards while celebrating the strength of Bangladeshi talent.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {workflow.map((stage) => (
              <Card key={stage.title} className="h-full space-y-3 border border-card-border bg-white/90 p-6 shadow-sm">
                <stage.icon className="h-6 w-6 text-accent" />
                <h3 className="text-lg font-semibold">{stage.title}</h3>
                <p className="text-sm text-muted">{stage.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] bg-gradient-to-br from-[#f0fff0] via-[#ffffff] to-[#dff4df] p-10 shadow-[0_20px_48px_rgba(0,30,0,0.06)]">
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div className="space-y-6">
              <Badge className="bg-accent/15 text-accent">Loved by teams</Badge>
              <h2 className="text-3xl font-semibold md:text-4xl">What clients say</h2>
              <p className="text-lg text-muted">
                Founders, agencies, and product teams rely on TalentHunt BD to keep their roadmaps moving with world-class freelancers.
              </p>
            </div>
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="space-y-3 border border-card-border bg-white/95 p-6 shadow-sm">
                  <p className="text-sm text-foreground">“{testimonial.quote}”</p>
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted/80">
                    {testimonial.name} · {testimonial.role}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-transparent bg-gradient-to-r from-[#dff4df] via-[#b9ebc0] to-[#f0fff0] p-10 text-center shadow-[0_20px_48px_rgba(0,30,0,0.06)]">
          <div className="mx-auto max-w-3xl space-y-4">
            <h2 className="text-3xl font-semibold md:text-4xl">Start hiring from the marketplace today</h2>
            <p className="text-lg text-muted">
              Post a brief, receive curated matches, and collaborate inside TalentHunt BD with escrow-backed assurance.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/signup?role=employer">Post a job for free</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="bg-card text-foreground shadow-sm">
                <Link href="/hire">Learn how hiring works</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

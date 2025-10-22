import Link from "next/link";
import { ArrowRight, BadgeCheck, MessageCircle, ShieldCheck, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/layout/site-header";

const valueProps = [
  {
    title: "Verified Bangladeshi Talent",
    description: "Find rigorously vetted professionals across development, design, marketing, and support roles.",
    icon: UsersRound,
  },
  {
    title: "Transparent Collaboration",
    description: "Track proposals, milestones, and project updates in one secure workspace with real-time chat.",
    icon: MessageCircle,
  },
  {
    title: "Protected Engagements",
    description: "Use escrow-style milestones and admin oversight to keep every project on track and dispute-free.",
    icon: ShieldCheck,
  },
];

const workflow = [
  {
    step: "1",
    title: "Post a job or build your profile",
    description: "Share your project requirements or set up a compelling freelancer profile in a few guided steps.",
  },
  {
    step: "2",
    title: "Match instantly",
    description: "Search by skills, budget, or category and receive smart recommendations tailored to local expertise.",
  },
  {
    step: "3",
    title: "Collaborate & deliver",
    description: "Chat, exchange files, track progress, and finalize payouts directly from your dashboard.",
  },
];

export default function Home() {
  return (
    <div>
      <SiteHeader />
      <main className="relative mx-auto flex min-h-[calc(100vh-76px)] w-full max-w-6xl flex-col gap-24 px-6 pb-24 pt-12 md:pt-24">
      <section className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-8">
          <Badge className="w-fit bg-accent/15 text-accent">Built for Bangladesh</Badge>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
            The most trusted marketplace for Bangladeshi freelancers and ambitious teams.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
            TalentHunt BD connects local specialists with global and domestic opportunities. Manage proposals, milestones, and delivery with admin-backed protection at every stage.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/auth/signup?role=employer">
                Post a Job <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/auth/signup?role=freelancer">Join as Freelancer</Link>
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-accent" /> Escrow-style project tracking
            </span>
            <span className="inline-flex items-center gap-2">
              <UsersRound className="h-4 w-4 text-accent" /> 25+ expertise categories
            </span>
          </div>
        </div>
        <Card className="relative overflow-hidden bg-gradient-to-br from-foreground/5 via-card to-card shadow-xl">
          <div className="space-y-6">
            <div className="rounded-[var(--radius-lg)] border border-white/20 bg-white/30 p-5 shadow-lg backdrop-blur md:p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted">Open milestone</p>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  Funded
                </span>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-foreground">Dashboard redesign for fintech app</h3>
              <p className="mt-3 text-sm text-muted">
                &ldquo;We hired Nazmul within 48 hours and shipped a polished dashboard before our investor demo.&rdquo;
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[var(--radius-md)] border border-white/10 bg-white/40 p-4 shadow-sm backdrop-blur">
                <p className="text-sm text-muted">Skills matched</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">UI/UX · React · Tailwind</p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-white/10 bg-white/40 p-4 shadow-sm backdrop-blur">
                <p className="text-sm text-muted">Payout submitted</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">৳ 48,500</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section id="features" className="space-y-10 scroll-mt-24">
        <header className="max-w-3xl space-y-4">
          <Badge className="bg-foreground text-background">Why TalentHunt BD</Badge>
          <h2 className="text-3xl font-semibold md:text-4xl">Everything you need to deliver world-class projects</h2>
          <p className="text-lg text-muted">
            From job discovery to final payout, our tools and local support team help Bangladeshi professionals shine on a global stage.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {valueProps.map((feature) => (
            <Card key={feature.title} className="space-y-4 border-none bg-foreground/5 shadow-none">
              <feature.icon className="h-10 w-10 text-accent" />
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="workflow" className="space-y-10 scroll-mt-24">
        <header className="max-w-2xl space-y-4">
          <Badge className="bg-foreground text-background">How it works</Badge>
          <h2 className="text-3xl font-semibold md:text-4xl">Launch in days, not weeks</h2>
          <p className="text-lg text-muted">Structured workflows for both freelancers and employers keep every milestone clear and accountable.</p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {workflow.map((item) => (
            <Card key={item.step} className="space-y-4 border border-card-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-lg font-semibold text-accent">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-[var(--radius-lg)] border border-card-border bg-card/80 p-10 shadow-lg backdrop-blur">
        <div className="grid gap-8 md:grid-cols-[2fr_1fr] md:items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold md:text-4xl">Ready to unlock the best of Bangladesh?</h2>
            <p className="text-lg text-muted">
              Join TalentHunt BD to work with vetted professionals, build resilient teams, and support the local tech ecosystem.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button asChild>
              <Link href="/auth/signup?role=employer">Start Hiring</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/auth/signup?role=freelancer">Browse Opportunities</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
    </div>
  );
}

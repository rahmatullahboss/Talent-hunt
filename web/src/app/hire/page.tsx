import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CalendarCheck,
  ClipboardList,
  Clock4,
  Globe2,
  Handshake,
  Lightbulb,
  ListChecks,
  MessageSquare,
  ShieldCheck,
  Users2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const hiringPillars = [
  {
    title: "Craft the perfect brief",
    description:
      "Capture outcomes, timelines, and budget in minutes with our guided brief builder that mirrors Upwork's best practices.",
    icon: ClipboardList,
  },
  {
    title: "Match with vetted talent",
    description:
      "Receive shortlists from our talent advisors or browse the marketplace to invite professionals who are already screened.",
    icon: BadgeCheck,
  },
  {
    title: "Launch with protected contracts",
    description:
      "Kick off confidently with escrow, compliance support, and milestone tracking handled inside TalentHunt BD.",
    icon: ShieldCheck,
  },
];

const playbook = [
  {
    step: "01",
    title: "Share your goals",
    description:
      "Tell us what you are building and any constraints. Upload specs or link to previous work so talent understands the context.",
    icon: Lightbulb,
  },
  {
    step: "02",
    title: "Review curated matches",
    description:
      "Within 48 hours you will receive 3-5 profiles with portfolios, rates, and availability sourced from our Bangladeshi network.",
    icon: ListChecks,
  },
  {
    step: "03",
    title: "Interview & align",
    description:
      "Schedule interviews directly or invite talent to respond asynchronously. Our team can facilitate structured interviews on request.",
    icon: MessageSquare,
  },
  {
    step: "04",
    title: "Start and scale",
    description:
      "Lock in milestones, automate invoices, and extend contracts as projects grow. We stay close to unblock you at every step.",
    icon: Handshake,
  },
];

const assurances = [
  {
    title: "Local compliance ready",
    description: "Work with confidence knowing NDAs, tax docs, and currency conversions are supported out of the box.",
    icon: Globe2,
  },
  {
    title: "Time-saving workflows",
    description: "Recurring check-ins, automated reminders, and shared dashboards keep teams aligned without extra tools.",
    icon: Clock4,
  },
  {
    title: "Dedicated success partner",
    description: "Tap a talent advisor anytime to help scope roles, review proposals, or resolve delivery questions.",
    icon: Users2,
  },
];

const faqs = [
  {
    question: "How fast can I start working with talent?",
    answer:
      "Most teams finalize a hire within 5 business days. Profiles arrive in 48 hours and kickoff follows once contracts are signed.",
  },
  {
    question: "Can you help with longer-term engagements?",
    answer:
      "Yes. Convert projects into retainers, extend milestones, and manage renewals directly in TalentHunt BD with our support.",
  },
  {
    question: "What if a project needs replacement talent?",
    answer:
      "Your success partner will source backups immediately. Escrowed funds remain protected until you approve deliverables.",
  },
];

export default function HirePage() {
  return (
    <div className="min-h-screen text-foreground">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-24 pt-16">
        <header className="grid gap-12 rounded-[32px] bg-white/90 p-10 shadow-[0_24px_64px_rgba(0,30,0,0.08)] md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div className="space-y-6">
            <Badge className="w-fit bg-accent/15 text-accent">How to hire on TalentHunt BD</Badge>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Build your dream team without the guesswork.
            </h1>
            <p className="text-lg text-muted">
              Follow the same playbook used by high-growth Bangladeshi startups: clarify the brief, compare vetted freelancers, and launch with escrow-backed confidence.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/onboarding">
                  Talk to a hiring expert <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="bg-card text-foreground shadow-sm">
                <Link href="/marketplace">Explore the marketplace</Link>
              </Button>
            </div>
          </div>
          <Card className="space-y-5 border border-card-border bg-white/95 p-6 shadow-sm">
            <div className="space-y-4">
              {hiringPillars.map((pillar) => (
                <div key={pillar.title} className="flex items-start gap-4 rounded-2xl border border-card-border/70 bg-white p-4">
                  <pillar.icon className="mt-1 h-6 w-6 text-accent" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{pillar.title}</p>
                    <p className="text-sm text-muted">{pillar.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button asChild size="lg" className="w-full">
              <Link href="/signup?role=employer">Create a client account</Link>
            </Button>
          </Card>
        </header>

        <section className="space-y-10">
          <header className="space-y-4 text-center">
            <Badge className="mx-auto bg-accent/15 text-accent">Your hiring playbook</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Every stage supported from brief to delivery</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              We combine Upwork-style flexibility with local expertise so you can hire faster, collaborate better, and stay compliant.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {playbook.map((item) => (
              <Card key={item.title} className="relative h-full space-y-3 overflow-hidden border border-card-border bg-white/90 p-6 shadow-sm">
                <span className="absolute right-6 top-6 text-4xl font-semibold text-foreground/10">{item.step}</span>
                <div className="flex items-center gap-3">
                  <item.icon className="h-6 w-6 text-accent" />
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm text-muted">{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-10 rounded-[32px] bg-white/90 p-10 shadow-[0_20px_48px_rgba(0,30,0,0.06)] md:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <Badge className="bg-accent/15 text-accent">Why clients trust us</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">A hiring partner built for Bangladesh</h2>
            <p className="text-lg text-muted">
              From contract generation to dispute resolution, TalentHunt BD keeps your projects moving while respecting local regulations and payment preferences.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-card-border bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Briefcase className="h-4 w-4 text-accent" /> 1,200+ roles filled
                </div>
                <p className="mt-2 text-xs text-muted">Across product, engineering, design, and operations teams.</p>
              </div>
              <div className="rounded-2xl border border-card-border bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CalendarCheck className="h-4 w-4 text-accent" /> 48h shortlists
                </div>
                <p className="mt-2 text-xs text-muted">Curated matches surfaced within two business days.</p>
              </div>
              <div className="rounded-2xl border border-card-border bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ShieldCheck className="h-4 w-4 text-accent" /> Escrow protection
                </div>
                <p className="mt-2 text-xs text-muted">Release payments only after approving deliverables.</p>
              </div>
              <div className="rounded-2xl border border-card-border bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MessageSquare className="h-4 w-4 text-accent" /> Ongoing support
                </div>
                <p className="mt-2 text-xs text-muted">Chat with a success partner anytime during the engagement.</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {assurances.map((item) => (
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

        <section className="space-y-8">
          <header className="space-y-3 text-center">
            <Badge className="mx-auto bg-accent/15 text-accent">FAQs</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Hiring questions, answered</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              Everything you need to know before kicking off your next project on TalentHunt BD.
            </p>
          </header>
          <div className="grid gap-4">
            {faqs.map((faq) => (
              <Card key={faq.question} className="space-y-2 border border-card-border bg-white/95 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground">{faq.question}</h3>
                <p className="text-sm text-muted">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-transparent bg-gradient-to-r from-[#dff4df] via-[#b9ebc0] to-[#f0fff0] p-10 text-center shadow-[0_20px_48px_rgba(0,30,0,0.06)]">
          <div className="mx-auto max-w-3xl space-y-4">
            <h2 className="text-3xl font-semibold md:text-4xl">Ready to start hiring smarter?</h2>
            <p className="text-lg text-muted">
              Join hundreds of founders and leaders building with top Bangladeshi talent through TalentHunt BD.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/signup?role=employer">Create a client account</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="bg-card text-foreground shadow-sm">
                <Link href="/onboarding">Book a strategy call</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

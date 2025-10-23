import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  FileQuestion,
  Headset,
  LifeBuoy,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Find answers, resources, and direct support for your TalentHunt BD account.",
};

const supportChannels = [
  {
    title: "Guided onboarding",
    description: "Pair with our success team to fine-tune your profile, briefs, and hiring process.",
    icon: LifeBuoy,
    action: { label: "Book a session", href: "mailto:rahmatullahzisan@gmail.com?subject=Guided%20Onboarding%20Request" },
  },
  {
    title: "Dedicated support chat",
    description: "Message us in-app or on WhatsApp for real-time help with proposals, contracts, or payments.",
    icon: MessageCircle,
    action: { label: "Start a chat", href: "https://wa.me/8801700000000" },
  },
  {
    title: "Priority billing assistance",
    description: "Get quick answers on invoices, escrow releases, and payout schedules to keep work moving.",
    icon: ShieldCheck,
    action: { label: "Contact billing", href: "mailto:rahmatullahzisan@gmail.com?subject=Billing%20Assistance" },
  },
];

const resourceGuides = [
  {
    title: "Platform essentials",
    description: "Learn the basics of posting a job, submitting a proposal, and managing milestones.",
    icon: FileQuestion,
    href: "/resources/platform-essentials.pdf",
  },
  {
    title: "Payment & escrow handbook",
    description: "Understand how BDT payouts, escrow protection, and dispute resolution work on TalentHunt.",
    icon: ShieldCheck,
    href: "/resources/payment-handbook.pdf",
  },
  {
    title: "Safety & compliance",
    description: "Review best practices for secure collaboration, verified identities, and contract policies.",
    icon: Headset,
    href: "/resources/safety-compliance.pdf",
  },
];

const faqs = [
  {
    question: "How quickly will support respond?",
    answer:
      "Our Dhaka-based team replies within 24 hours on weekdays. Priority clients and Top Rated talent typically hear back within a few hours.",
  },
  {
    question: "Where can I track open support tickets?",
    answer:
      "Visit the Support tab in your dashboard to view ticket status, share additional context, or close resolved requests.",
  },
  {
    question: "Can I talk to someone live?",
    answer:
      "Yes. Use the Start a chat option above or request a call through the onboarding link. A success partner will reach out during business hours.",
  },
];

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-foreground">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-24 pt-12">
        <section className="space-y-6 text-center md:text-left">
          <Badge className="mx-auto bg-accent/15 text-accent md:mx-0">Help Center</Badge>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              We&apos;re here to keep your projects moving.
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted md:mx-0">
              Find quick answers, download playbooks, or speak directly with our success team. Whether you&apos;re hiring or delivering work, we&apos;re on hand to support you.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-start">
            <Button asChild size="lg">
              <Link href="mailto:rahmatullahzisan@gmail.com?subject=Support%20Request">Email support</Link>
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Clock className="h-4 w-4 text-accent" />
              Weekdays 9:00-18:00 BST
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-foreground md:text-3xl">Talk to the right team</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {supportChannels.map((channel) => (
              <Card key={channel.title} className="flex h-full flex-col gap-4 border border-card-border bg-white/95 p-6 shadow-sm">
                <channel.icon className="h-8 w-8 text-accent" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">{channel.title}</h3>
                  <p className="text-sm text-muted">{channel.description}</p>
                </div>
                <Button asChild variant="ghost" className="mt-auto justify-start px-0 text-accent hover:text-accent">
                  <Link href={channel.action.href}>{channel.action.label}</Link>
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-foreground md:text-3xl">Resource library</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {resourceGuides.map((guide) => (
              <Card key={guide.title} className="flex h-full flex-col gap-4 border border-card-border bg-white/95 p-6 shadow-sm">
                <guide.icon className="h-8 w-8 text-accent" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">{guide.title}</h3>
                  <p className="text-sm text-muted">{guide.description}</p>
                </div>
                <Button asChild variant="secondary" className="mt-auto w-fit bg-card text-foreground shadow-sm">
                  <Link href={guide.href}>Download guide</Link>
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground md:text-3xl">Common questions</h2>
          <div className="grid gap-4">
            {faqs.map((faq) => (
              <Card key={faq.question} className="border border-card-border bg-white/95 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-transparent bg-gradient-to-r from-[#dff4df] via-[#b9ebc0] to-[#f0fff0] p-8 text-center shadow-[0_20px_48px_rgba(0,30,0,0.06)] md:p-10">
          <div className="mx-auto max-w-2xl space-y-4">
            <h2 className="text-3xl font-semibold md:text-4xl">Need urgent help?</h2>
            <p className="text-lg text-muted">
              Call our priority line at <span className="font-semibold text-foreground">01639-590392</span> for time-sensitive issues involving live projects or payments.
            </p>
            <Button asChild size="lg">
              <Link href="tel:01639590392">Call support</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

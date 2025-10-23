import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Globe2,
  Heart,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "About",
  description: "Learn how TalentHunt BD connects Bangladeshi talent with global opportunities.",
};

const stats = [
  { label: "Verified freelancers", value: "12K+" },
  { label: "Active clients", value: "2.4K" },
  { label: "Projects launched", value: "18K+" },
  { label: "Avg. client rating", value: "4.9/5" },
];

const values = [
  {
    title: "Bangladesh first",
    description:
      "We champion local specialists, investing in tools and training that help them compete on a global stage.",
    icon: Globe2,
  },
  {
    title: "Trust in every match",
    description:
      "From identity checks to milestone escrow, we design systems that keep work transparent and dependable.",
    icon: ShieldCheck,
  },
  {
    title: "Progress together",
    description:
      "Clients, talent, and our team collaborate closely, sharing data and feedback to raise the bar for everyone.",
    icon: UsersRound,
  },
  {
    title: "Create with heart",
    description:
      "We stay human. Personal outreach, Dhaka-based support, and community events keep relationships front and center.",
    icon: Heart,
  },
];

const milestones = [
  {
    year: "2021",
    headline: "Launched the TalentHunt beta",
    copy: "Opened our private marketplace with fifty vetted freelancers and a handful of startup partners.",
  },
  {
    year: "2022",
    headline: "Introduced escrow-backed payments",
    copy: "Rolled out milestone protection and automated invoicing so both sides could collaborate with confidence.",
  },
  {
    year: "2023",
    headline: "Expanded nationwide",
    copy: "Built out Dhaka and Chattogram success pods and brought verified agencies into the platform.",
  },
  {
    year: "2024",
    headline: "Partnered with global accelerators",
    copy: "Connected Bangladeshi operators with venture-backed teams abroad, unlocking cross-border opportunities.",
  },
];

const leadership = [
  {
    name: "Farhan Rahman",
    role: "Founder and CEO",
    bio: "Product leader with a decade of marketplace experience, previously at regional startup accelerators.",
  },
  {
    name: "Nilufa Akter",
    role: "Head of Talent Success",
    bio: "Former freelancer turned community builder, leading the vetting, mentorship, and events programs.",
  },
  {
    name: "Zayed Chowdhury",
    role: "Director of Client Strategy",
    bio: "Worked with enterprise clients across APAC and now helps Bangladeshi teams scale responsibly.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-foreground">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-24 pt-12">
        <section className="space-y-6 text-center md:text-left">
          <Badge className="mx-auto bg-accent/15 text-accent md:mx-0">About TalentHunt BD</Badge>
          <div className="space-y-5">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Building Bangladesh&apos;s most trusted talent marketplace.
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-muted md:mx-0">
              TalentHunt BD brings vetted Bangladeshi specialists together with founders, agencies, and growth teams who value
              quality, transparency, and a local-first partnership. We mirror the best parts of platforms like Upwork, then add
              the service, support, and cultural understanding our community expects.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-start">
            <Button asChild size="lg">
              <Link href="/talent">
                Meet the talent <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="bg-card text-foreground shadow-sm">
              <Link href="/signup?role=employer">Hire with us</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-6 rounded-[32px] bg-white/90 p-8 shadow-[0_20px_48px_rgba(0,30,0,0.06)] md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="space-y-8">
          <div className="space-y-3 text-center md:text-left">
            <Badge className="mx-auto bg-accent/15 text-accent md:mx-0">What guides us</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Values that keep us accountable</h2>
            <p className="mx-auto max-w-3xl text-lg text-muted md:mx-0">
              We blend technology with a hands-on partner mindset. Every feature and touchpoint is designed to raise trust in
              Bangladeshi talent on the global stage.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {values.map((value) => (
              <Card key={value.title} className="flex h-full flex-col gap-4 border border-card-border bg-white/95 p-6 shadow-sm">
                <value.icon className="h-8 w-8 text-accent" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">{value.title}</h3>
                  <p className="text-sm text-muted">{value.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="space-y-3 text-center md:text-left">
            <Badge className="mx-auto bg-accent/15 text-accent md:mx-0">Our journey</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Milestones worth celebrating</h2>
            <p className="mx-auto max-w-3xl text-lg text-muted md:mx-0">
              From a beta experiment to a nationwide platform, we keep iterating with feedback from the freelancers and clients
              who rely on us every day.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {milestones.map((milestone) => (
              <Card key={milestone.year} className="flex h-full flex-col gap-3 border border-card-border bg-white/95 p-6 shadow-sm">
                <span className="inline-flex w-fit items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
                  {milestone.year}
                </span>
                <h3 className="text-lg font-semibold text-foreground">{milestone.headline}</h3>
                <p className="text-sm text-muted">{milestone.copy}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="space-y-3 text-center md:text-left">
            <Badge className="mx-auto bg-accent/15 text-accent md:mx-0">Leadership</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">The team behind TalentHunt BD</h2>
            <p className="mx-auto max-w-3xl text-lg text-muted md:mx-0">
              A mix of marketplace veterans, community builders, and client strategists guide our growth and partner programs.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {leadership.map((person) => (
              <Card key={person.name} className="flex h-full flex-col gap-3 border border-card-border bg-white/95 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                    {person.name
                      .split(" ")
                      .map((part) => part.charAt(0))
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{person.name}</h3>
                    <p className="text-sm text-muted">{person.role}</p>
                  </div>
                </div>
                <p className="text-sm text-muted">{person.bio}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] bg-white/90 p-8 shadow-[0_20px_48px_rgba(0,30,0,0.06)] md:p-10">
          <div className="grid gap-8 md:grid-cols-[0.6fr_0.4fr] md:items-center">
            <div className="space-y-4">
              <Badge className="bg-accent/15 text-accent">Partner with us</Badge>
              <h2 className="text-3xl font-semibold md:text-4xl">Bring your next project to life</h2>
              <p className="text-lg text-muted">
                Ready to build a product squad, launch a campaign, or scale operations? Tell us what you need and we will match
                you with specialists in under forty eight hours.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/signup?role=employer">Start hiring</Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="bg-card text-foreground shadow-sm">
                  <Link href="/support">Talk to support</Link>
                </Button>
              </div>
            </div>
            <Card className="flex h-full flex-col gap-3 border border-card-border bg-white p-6 shadow-sm">
              <Sparkles className="h-8 w-8 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">Why teams choose us</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>Curated shortlists delivered within forty eight hours.</li>
                <li>Escrow protected payments and transparent milestones.</li>
                <li>Hands-on success partners based in Bangladesh.</li>
              </ul>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  Compass,
  HeartHandshake,
  Laptop,
  Lightbulb,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join TalentHunt BD and help build the future of work for Bangladeshi professionals.",
};

const benefits = [
  {
    title: "Remote first",
    description: "Work from anywhere in Bangladesh with quarterly coworking weeks in Dhaka.",
    icon: Laptop,
  },
  {
    title: "Grow with us",
    description: "Annual learning stipend, leadership coaching, and conference travel support.",
    icon: Lightbulb,
  },
  {
    title: "Wellness covered",
    description: "Private health coverage for you and your family, plus mental health days.",
    icon: HeartHandshake,
  },
  {
    title: "Meaningful ownership",
    description: "Competitive salary packages with performance incentives and employee stock options.",
    icon: Compass,
  },
];

const teamCulture = [
  {
    quote:
      "We make decisions quickly, stay close to our users, and ship improvements every week. It feels like building the marketplace we always wanted as freelancers.",
    name: "Sarika Islam",
    role: "Product Design Lead",
  },
  {
    quote:
      "Every client and talent story fuels us. Success partners, engineers, and marketing brainstorm together to keep experiences human and local.",
    name: "Rafiq Ahmed",
    role: "Head of Talent Success",
  },
];

const openings = [
  {
    title: "Senior Frontend Engineer",
    department: "Product and Engineering",
    location: "Remote, Bangladesh",
    type: "Full time",
    posted: "Posted 1 week ago",
    summary: "Own the talent experience across onboarding and proposals using Next.js and modern tooling.",
    applyHref: "mailto:rahmatullahzisan@gmail.com?subject=Senior%20Frontend%20Engineer%20Application",
  },
  {
    title: "Talent Success Partner",
    department: "Operations",
    location: "Dhaka, Bangladesh",
    type: "Full time",
    posted: "Posted 3 days ago",
    summary: "Guide top freelancers through vetting, onboarding, and success programs tailored to their goals.",
    applyHref: "mailto:rahmatullahzisan@gmail.com?subject=Talent%20Success%20Partner%20Application",
  },
  {
    title: "Growth Marketing Manager",
    department: "Marketing",
    location: "Hybrid, Dhaka",
    type: "Full time",
    posted: "Posted today",
    summary: "Lead lifecycle campaigns that introduce clients to Bangladesh's best freelance talent.",
    applyHref: "mailto:rahmatullahzisan@gmail.com?subject=Growth%20Marketing%20Manager%20Application",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-foreground">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-24 pt-12">
        <section className="space-y-6 text-center md:text-left">
          <Badge className="mx-auto bg-accent/15 text-accent md:mx-0">Careers at TalentHunt BD</Badge>
          <div className="space-y-5">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Build the platform powering Bangladesh’s next generation of talent.
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-muted md:mx-0">
              We are a fast growing team of product builders, community leaders, and talent advocates on a mission to unlock
              more flexible work for Bangladeshi professionals. Join us to shape the future of hiring and freelancing at home.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-start">
            <Button asChild size="lg">
              <Link href="#open-roles">
                View open roles <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="bg-card text-foreground shadow-sm">
              <Link href="mailto:rahmatullahzisan@gmail.com?subject=Resume%20Submission">Send your resume</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-6 rounded-[32px] bg-white/90 p-8 shadow-[0_20px_48px_rgba(0,30,0,0.06)] md:grid-cols-2">
          <div className="space-y-3">
            <Badge className="w-fit bg-accent/15 text-accent">Why join us</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">A mission with real impact</h2>
            <p className="text-lg text-muted">
              Millions of professionals in Bangladesh are ready for global work. We are building the tools, trust, and community
              that make those careers possible.
            </p>
            <div className="flex items-center gap-3 text-sm text-muted">
              <Users className="h-5 w-5 text-accent" />
              30 teammates in Dhaka, Chittagong, and remote hubs
            </div>
            <div className="flex items-center gap-3 text-sm text-muted">
              <Briefcase className="h-5 w-5 text-accent" />
              Serving thousands of freelancers and emerging companies
            </div>
            <div className="flex items-center gap-3 text-sm text-muted">
              <CalendarDays className="h-5 w-5 text-accent" />
              Weekly release cycles, quarterly team offsites
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="flex h-full flex-col gap-3 border border-card-border bg-white/95 p-5 shadow-sm">
                <benefit.icon className="h-7 w-7 text-accent" />
                <h3 className="text-base font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-sm text-muted">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-3 text-center md:text-left">
            <Badge className="mx-auto bg-accent/15 text-accent md:mx-0">Inside TalentHunt BD</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">How we work together</h2>
            <p className="mx-auto max-w-3xl text-lg text-muted md:mx-0">
              We balance high expectations with genuine care. Everyone ships, everyone listens, and we always make time to celebrate the wins.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {teamCulture.map((story) => (
              <Card key={story.name} className="flex h-full flex-col gap-3 border border-card-border bg-white/95 p-6 shadow-sm">
                <p className="text-sm text-foreground">“{story.quote}”</p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{story.name}</p>
                  <p className="text-xs uppercase tracking-wide text-muted">{story.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section id="open-roles" className="space-y-8">
          <div className="space-y-3 text-center md:text-left">
            <Badge className="mx-auto bg-accent/15 text-accent md:mx-0">Open roles</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Join the team</h2>
            <p className="mx-auto max-w-3xl text-lg text-muted md:mx-0">
              Do not see your perfect fit? Reach out anyway. We read every application and love connecting with mission aligned builders.
            </p>
          </div>
          <div className="grid gap-6">
            {openings.map((role) => (
              <Card key={role.title} className="flex flex-col gap-4 border border-card-border bg-white/95 p-6 shadow-sm">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{role.title}</h3>
                    <p className="text-sm text-muted">{role.department}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted md:text-sm">
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
                      {role.type}
                    </span>
                    <span>{role.location}</span>
                    <span>{role.posted}</span>
                  </div>
                </div>
                <p className="text-sm text-muted">{role.summary}</p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button asChild size="sm">
                    <Link href={role.applyHref}>Apply now</Link>
                  </Button>
                  <Button asChild variant="link" className="h-auto px-0 text-accent">
                    <Link href="mailto:rahmatullahzisan@gmail.com?subject=General%20Career%20Inquiry">Refer a teammate</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-transparent bg-gradient-to-r from-[#dff4df] via-[#b9ebc0] to-[#f0fff0] p-8 text-center shadow-[0_20px_48px_rgba(0,30,0,0.06)] md:p-10">
          <div className="mx-auto max-w-3xl space-y-4">
            <h2 className="text-3xl font-semibold md:text-4xl">Let us build the future of work together</h2>
            <p className="text-lg text-muted">
              Ready to make a difference for freelancers and clients across Bangladesh? Share your story, show us your work, and we will take it from there.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="mailto:rahmatullahzisan@gmail.com">Email our hiring team</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="bg-card text-foreground shadow-sm">
                <Link href="/about">Learn about our mission</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

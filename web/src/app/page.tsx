import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CircleDollarSign,
  Globe2,
  Layers,
  Lightbulb,
  LineChart,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  verification: {
    google: "google8e80767e6782e05e.html",
  },
};

const trustedBy = ["Pathao", "ShopUp", "bKash", "iFarmer", "Shikho", "TallyKhata"];

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
];

export default async function Home() {
  // Redirect logged-in freelancers to Find Work page
  const auth = await getCurrentUser();
  if (auth?.profile?.role === "freelancer" && auth.profile.onboarding_complete) {
    redirect("/freelancer/jobs");
  }
  return (
    <div className="min-h-screen text-foreground">
      <SiteHeader />
      
      {/* Hero Section - Upwork Style */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#14a800]/95 via-[#1a5d0a] to-[#0d3d00]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-white/10 blur-3xl" />
        </div>
        
        {/* Hero Image - Right side */}
        <div className="absolute right-0 top-0 hidden h-full w-1/2 lg:block">
          <div className="relative h-full w-full">
            <Image
              src="https://res.cloudinary.com/dpnccgsja/image/upload/v1734968744/freelancer-hero_fnywvv.jpg"
              alt="Freelancer working"
              fill
              className="object-cover object-center opacity-90"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#14a800] via-[#14a800]/60 to-transparent" />
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="max-w-2xl space-y-8">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
              Connecting businesses in need to freelancers who deliver
            </h1>
            
            {/* Tabs */}
            <div className="flex gap-0 rounded-full bg-black/20 p-1 backdrop-blur-sm w-fit">
              <Link 
                href="/talent"
                className="rounded-full bg-white px-8 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-100"
              >
                Find talent
              </Link>
              <Link 
                href="/jobs"
                className="rounded-full px-8 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Browse jobs
              </Link>
            </div>

            {/* Search Bar */}
            <div className="relative flex items-center rounded-full border border-white/20 bg-white p-2 shadow-2xl max-w-xl">
              <input
                type="text"
                placeholder="Search by role, skills, or keywords"
                className="flex-1 border-0 bg-transparent px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none"
              />
              <Button size="lg" className="rounded-full px-6">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>

            {/* Trusted By */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <span className="text-sm text-white/70">Trusted by</span>
              {trustedBy.slice(0, 4).map((brand) => (
                <span key={brand} className="text-sm font-medium text-white/90">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-24 px-6 pb-24 pt-20">
        
        {/* Categories Section */}
        <section className="space-y-10">
          <header className="space-y-4 text-center">
            <Badge className="mx-auto bg-accent/15 text-accent">Browse top skills</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Hire specialists across every discipline</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              Discover Upwork-quality talent without the global search. Every freelancer speaks your language—literally and figuratively.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => (
              <Card key={category.title} className="h-full space-y-3 border border-card-border bg-white/90 p-6 shadow-sm hover:shadow-md transition-shadow">
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

        {/* Why TalentHunt Section */}
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

        {/* How It Works Section */}
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
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-lg font-semibold text-accent">
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

        {/* Testimonials Section */}
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

        {/* CTA Section */}
        <section className="rounded-[32px] border border-transparent bg-gradient-to-r from-[#14a800] via-[#1a8209] to-[#14a800] p-10 text-center shadow-[0_20px_48px_rgba(0,30,0,0.06)]">
          <div className="mx-auto max-w-3xl space-y-4">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Ready to hire with an Upwork-level experience?</h2>
            <p className="text-lg text-white/80">
              Create a free employer profile, share your brief, and meet Bangladesh&apos;s top freelancers within days.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="bg-white text-[#14a800] hover:bg-gray-100">
                <Link href="/signup?role=employer">
                  Get started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
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

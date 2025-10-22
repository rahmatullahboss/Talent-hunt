import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  MessageCircle,
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

const stats = [
  { value: "8K+", label: "Verified freelancers" },
  { value: "1.2K", label: "Monthly jobs posted" },
  { value: "92%", label: "Repeat clients" },
  { value: "৳18cr", label: "Secure payouts processed" },
];

const categories = [
  { title: "Development & IT", description: "React, Next.js, Laravel, AI, QA" },
  { title: "Design & Creative", description: "Product design, branding, illustration" },
  { title: "Sales & Marketing", description: "Growth strategy, automation, SEO" },
  { title: "Writing & Translation", description: "Copywriting, scripts, localization" },
  { title: "Admin & Support", description: "Virtual assistants, finance, HR" },
  { title: "Product & Project", description: "Scrum masters, analysts, product ops" },
];

const assurances = [
  {
    title: "Local expertise, global standards",
    description:
      "Profiles are verified by Bangladeshi talent specialists so you work with professionals who understand your market and deliver at a global level.",
    icon: UsersRound,
  },
  {
    title: "Managed collaboration",
    description:
      "Track milestones, approvals, and feedback loops in one shared workspace. Our team steps in whenever you need additional support.",
    icon: MessageCircle,
  },
  {
    title: "Protected payouts",
    description:
      "Milestones use escrow-style deposits and dispute assistance so every BDT transferred is backed by compliance-ready processes.",
    icon: ShieldCheck,
  },
];

const workflow = [
  {
    step: "1",
    title: "Tell us what you need",
    description: "Post a job in minutes or book a discovery call with our success team for complex hiring needs.",
  },
  {
    step: "2",
    title: "Match with the right pros",
    description: "Receive curated shortlists within 24 hours or browse handpicked talent in the marketplace.",
  },
  {
    step: "3",
    title: "Launch and scale",
    description: "Collaborate securely, approve deliverables, and release payouts when your milestones are complete.",
  },
];

const testimonials = [
  {
    quote:
      "TalentHunt BD helped us assemble a remote product squad in Dhaka that now ships features twice as fast without compromising quality.",
    name: "Anika Rahman",
    role: "Head of Product, Chaldal",
  },
  {
    quote:
      "As a motion designer, I love how transparent the milestone reviews and payouts are. It feels like working with an in-house team.",
    name: "Jubayer Hasan",
    role: "Freelance Motion Specialist",
  },
  {
    quote:
      "We scaled our support operations for Ramadan launches and TalentHunt BD matched us with bilingual agents in under 48 hours.",
    name: "Farhan Chowdhury",
    role: "Operations Lead, Daraz",
  },
];

const highlights = [
  {
    title: "Instant talent collections",
    description:
      "Browse pre-vetted squads for fintech, SaaS, and ecommerce with proven delivery records and case studies.",
    icon: Sparkles,
  },
  {
    title: "Outcome-first contracts",
    description:
      "Every contract includes milestone definitions, success metrics, and review cadences so expectations stay aligned.",
    icon: CheckCircle2,
  },
  {
    title: "Support that scales with you",
    description:
      "Dedicated success partners advise on rates, onboarding, and retention as your team grows.",
    icon: BadgeCheck,
  },
];

const trustedBy = ["Pathao", "ShopUp", "bKash", "iFarmer", "Shikho", "TallyKhata"];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-[#f4fbf8] to-white">
      <SiteHeader />
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-32 pt-16">
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <Badge className="w-fit bg-accent/10 text-accent">Bangladeshi talent, global ambitions</Badge>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-6xl">
              Build, scale, and collaborate in a light, confident workspace.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
              TalentHunt BD connects founders and teams with verified local professionals who deliver world-class experiences.
              Hire instantly, manage milestones, and get paid securely—all with the warmth of a light, Upwork-inspired interface.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="shadow-lg shadow-emerald-100">
                <Link href="/signup?role=employer">
                  Start hiring <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="secondary" asChild className="bg-white text-foreground shadow">
                <Link href="/signup?role=freelancer">Find work</Link>
              </Button>
            </div>
            <div className="grid gap-6 rounded-[var(--radius-lg)] border border-card-border bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:grid-cols-2">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <Card className="border-0 bg-gradient-to-br from-white/80 via-white to-emerald-50 p-8 shadow-xl">
            <div className="space-y-6">
              <div className="rounded-[var(--radius-lg)] border border-card-border/60 bg-white/90 p-6 shadow-sm">
                <div className="flex items-center justify-between text-xs font-medium text-muted">
                  <span className="inline-flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-accent" /> Milestone in review
                  </span>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-accent">৳ 68,500</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Mobile banking onboarding redesign</h3>
                <p className="mt-2 text-sm text-muted">
                  &ldquo;Working with Tanjila through TalentHunt BD meant every iteration felt collaborative and transparent.&rdquo;
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border border-card-border/60 bg-white p-5 shadow-sm">
                  <p className="text-sm text-muted">Team assembled</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">Product designer · UX writer · QA</p>
                </Card>
                <Card className="border border-card-border/60 bg-white p-5 shadow-sm">
                  <p className="text-sm text-muted">Time to hire</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">36 hours</p>
                </Card>
              </div>
              <div className="rounded-[var(--radius-md)] border border-card-border/60 bg-white p-5 shadow-sm">
                <p className="text-sm text-muted">Client rating</p>
                <div className="mt-3 flex items-center gap-2 text-foreground">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="text-lg font-semibold">4.9 / 5</span>
                  <span className="text-xs text-muted">(312 reviews)</span>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="space-y-10">
          <header className="max-w-3xl space-y-4">
            <Badge className="bg-white text-accent">Hire with confidence</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Why teams choose TalentHunt BD</h2>
            <p className="text-lg text-muted">
              A curated marketplace built specifically for Bangladesh, blending the polish of Upwork with local insight and concierge support.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {assurances.map((feature) => (
              <Card key={feature.title} className="h-full space-y-4 border border-card-border bg-white/90 p-6 shadow-sm">
                <feature.icon className="h-10 w-10 text-accent" />
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-10">
          <header className="max-w-2xl space-y-4">
            <Badge className="bg-white text-accent">All the skills you need</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Explore top categories</h2>
            <p className="text-lg text-muted">
              Flexible engagements across product teams, creative studios, and growth experts ready to plug into your roadmap.
            </p>
          </header>
          <div className="grid gap-4 md:grid-cols-3">
            {categories.map((category) => (
              <Card
                key={category.title}
                className="border border-card-border bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:border-accent/60 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
                <p className="mt-2 text-sm text-muted">{category.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-8 rounded-[var(--radius-lg)] border border-card-border bg-white/90 p-10 shadow-lg">
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div className="space-y-5">
              <Badge className="bg-accent text-accent-foreground">How it works</Badge>
              <h2 className="text-3xl font-semibold md:text-4xl">From kickoff to payout in three guided steps</h2>
              <p className="text-lg text-muted">
                We combine automation with human support so every engagement feels effortless, transparent, and on brand for your company.
              </p>
              <div className="grid gap-4">
                {workflow.map((item) => (
                  <div key={item.step} className="flex gap-4 rounded-[var(--radius-md)] border border-card-border/70 bg-white p-5 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-lg font-semibold text-accent">
                      {item.step}
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-foreground">{item.title}</p>
                      <p className="text-sm text-muted">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Card className="space-y-4 border border-card-border/70 bg-emerald-50/70 p-6">
              <h3 className="text-xl font-semibold text-foreground">Concierge onboarding</h3>
              <p className="text-sm text-muted">
                Share your job post or portfolio and our success team sets up your workspace, recommends milestones, and invites the right collaborators.
              </p>
              <Button asChild>
                <Link href="/onboarding">Book a free consultation</Link>
              </Button>
            </Card>
          </div>
        </section>

        <section className="space-y-10">
          <header className="space-y-4 text-center">
            <Badge className="mx-auto bg-white text-accent">Trusted by leaders</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Bangladesh&rsquo;s fastest growing teams use TalentHunt BD</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              From startups to enterprise innovators, teams rely on our vetted marketplace and light, modern tooling to deliver on every sprint.
            </p>
          </header>
          <div className="flex flex-wrap items-center justify-center gap-6 rounded-[var(--radius-lg)] border border-card-border bg-white/90 p-8 shadow-sm">
            {trustedBy.map((brand) => (
              <span key={brand} className="text-lg font-semibold text-foreground/80">
                {brand}
              </span>
            ))}
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="h-full border border-card-border bg-white/95 p-6 shadow-md">
              <Star className="h-8 w-8 text-accent" />
              <p className="mt-4 text-base text-foreground/90">“{testimonial.quote}”</p>
              <p className="mt-6 text-sm font-semibold text-foreground">{testimonial.name}</p>
              <p className="text-xs text-muted">{testimonial.role}</p>
            </Card>
          ))}
        </section>

        <section className="space-y-6 rounded-[var(--radius-lg)] border border-card-border bg-gradient-to-br from-emerald-500/10 via-white to-emerald-50 p-10 text-center shadow-xl">
          <h2 className="text-3xl font-semibold md:text-4xl text-foreground">
            Ready to experience the lightest talent marketplace in Bangladesh?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted">
            Join as a client or freelancer to access curated talent pools, transparent pricing, and a design language inspired by Upwork&rsquo;s beloved light theme.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/signup?role=employer">Post your first job</Link>
            </Button>
            <Button variant="secondary" asChild size="lg" className="bg-white text-foreground shadow">
              <Link href="/signup?role=freelancer">Launch your profile</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <Card key={item.title} className="h-full border border-card-border bg-white/90 p-6 shadow-sm">
              <item.icon className="h-8 w-8 text-accent" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.description}</p>
            </Card>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

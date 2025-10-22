import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Compass,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Trophy,
  UsersRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

const heroStats = [
  { value: "15k+", label: "Bangladeshi freelancers" },
  { value: "92%", label: "Client hire success" },
  { value: "24h", label: "Average match time" },
];

const marketplaceHighlights = [
  {
    title: "Verified talent across 150+ skills",
    description:
      "Build product squads, launch campaigns, or ship prototypes with specialists screened for quality and collaboration.",
    icon: UsersRound,
  },
  {
    title: "Guided onboarding and contracting",
    description:
      "Talent managers help you scope the work, set milestones, and onboard freelancers with compliant, localised contracts.",
    icon: Briefcase,
  },
  {
    title: "Protected payments and reporting",
    description:
      "Escrow, automated invoicing, and real-time dashboards keep every engagement transparent from proposal to payout.",
    icon: ShieldCheck,
  },
];

const catalog = [
  {
    title: "AI-ready product design sprint",
    price: "Starts at ৳85,000",
    description:
      "Ship wireframes, clickable prototypes, and a design system within 10 business days with Dhaka-based senior designers.",
  },
  {
    title: "Full-stack launch bundle",
    price: "Starts at ৳120,000",
    description:
      "Get a production-ready MVP with TypeScript, Next.js, and Supabase built by a curated trio of Bangladeshi engineers.",
  },
  {
    title: "Performance marketing accelerator",
    price: "Starts at ৳55,000",
    description:
      "Deploy paid and organic funnels optimised for the Bangladeshi market with clear weekly reporting dashboards.",
  },
];

const solutions = [
  {
    title: "Talent Marketplace",
    description: "Post a job or invite top-rated freelancers in minutes and manage hiring in one modern dashboard.",
    icon: Sparkles,
    cta: {
      label: "Post a job",
      href: "/signup?role=employer",
    },
  },
  {
    title: "Project Catalog",
    description: "Kick off pre-scoped engagements with transparent pricing crafted by verified Bangladeshi pros.",
    icon: CalendarCheck,
    cta: {
      label: "Browse catalog",
      href: "#catalog",
    },
  },
  {
    title: "Enterprise Suite",
    description: "Unlock dedicated success managers, curated talent clouds, and centralised compliance at scale.",
    icon: Building2,
    cta: {
      label: "Talk to sales",
      href: "/contact",
    },
  },
];

const testimonials = [
  {
    quote:
      "TalentHunt helped us ship a new mobile experience in half the time. Their Dhaka-based team plugged into our roadmap overnight.",
    name: "Anika Rahman",
    role: "Head of Product, Chaldal",
  },
  {
    quote:
      "Every freelancer we hired was vetted and proactive. The escrow-backed milestones gave our leadership complete peace of mind.",
    name: "Farhan Chowdhury",
    role: "Operations Lead, Daraz",
  },
  {
    quote:
      "We scaled marketing to three regions with one remote crew. Payments, reporting, and collaboration all felt effortless.",
    name: "Misha Akter",
    role: "Growth Director, ShopUp",
  },
];

const whyClientsChooseUs = [
  {
    title: "Localized expertise",
    description: "Hire teams fluent in Bangladeshi regulations, culture, and communication norms while working globally.",
    icon: Compass,
  },
  {
    title: "Outcome-first process",
    description: "Milestones, QA reviews, and dedicated talent partners keep every project focused on measurable results.",
    icon: CheckCircle2,
  },
  {
    title: "Data-backed insights",
    description: "Analytics reveal contract health, spend, and velocity so you can iterate faster with confidence.",
    icon: BarChart3,
  },
];

const trustedLogos = ["Pathao", "ShopUp", "bKash", "iFarmer", "Chaldal", "Shikho"];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fbf4] via-white to-[#e8f5eb] text-foreground">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-28 pt-16">
        <section className="grid items-center gap-12 rounded-[32px] bg-white/80 p-10 shadow-[0_30px_80px_rgba(20,168,0,0.12)] backdrop-blur-lg md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-7">
            <Badge className="bg-[#e0f7e8] text-accent">Bangladesh&apos;s Upwork-inspired HQ</Badge>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[#001b00] md:text-6xl">
              Hire elite Bangladeshi freelancers with the polish of Upwork and the focus of a boutique studio.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted">
              Build products, launch campaigns, and scale support with curated experts who collaborate across time zones.
              We pair modern workflows with dedicated guidance so every project moves from idea to delivery smoothly.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="shadow-[0_12px_30px_rgba(20,168,0,0.28)]">
                <Link href="/signup?role=employer">
                  Post a job for free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild className="bg-white text-foreground shadow-sm">
                <Link href="/freelancers">Browse top talent</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <Card key={stat.label} className="border border-card-border bg-[#f7fdf9] p-5 text-left shadow-none">
                  <p className="text-2xl font-semibold text-[#001b00]">{stat.value}</p>
                  <p className="text-xs uppercase tracking-wide text-muted">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>
          <Card className="relative flex h-full flex-col justify-between overflow-hidden border-none bg-gradient-to-br from-[#e8f9ed] via-white to-[#dff6e5] p-8 shadow-[0_24px_60px_rgba(0,40,0,0.1)]">
            <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-[#d4f4de] blur-3xl" aria-hidden />
            <div className="relative space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-[0_25px_60px_rgba(0,40,0,0.08)]">
                <div className="flex items-center justify-between text-xs font-medium text-muted">
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" /> AI Product Launch
                  </span>
                  <span className="rounded-full bg-[#e0f7e8] px-3 py-1 text-accent">৳ 210k</span>
                </div>
                <p className="mt-4 text-sm text-muted">
                  Dhaka-based PM, React engineer, and product designer collaborating through weekly sprints and Loom check-ins.
                </p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-[0_20px_40px_rgba(0,40,0,0.06)]">
                <p className="text-sm font-medium text-[#001b00]">“We delivered ahead of schedule with QA-ready handoffs and spotless documentation.”</p>
                <p className="mt-4 text-xs text-muted">— Sanika Roy, Product Designer</p>
              </div>
              <div className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-[0_12px_30px_rgba(0,40,0,0.05)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e0f7e8] text-sm font-semibold text-accent">
                  ZH
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#001b00]">Zara Haque</p>
                  <p className="text-xs text-muted">Full-stack Engineer · Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section id="marketplace" className="space-y-10">
          <div className="space-y-3 text-center md:text-left">
            <Badge className="mx-auto bg-[#001b00] text-white md:mx-0">Talent Marketplace</Badge>
            <h2 className="text-3xl font-semibold text-[#001b00] md:text-4xl">Everything you love about Upwork, tailored for Bangladesh</h2>
            <p className="mx-auto max-w-3xl text-lg text-muted md:mx-0">
              From instant job posts to curated shortlists, TalentHunt mirrors the best of Upwork’s experience while layering on
              local insights, compliance, and hands-on support for clients across the globe.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {marketplaceHighlights.map((highlight) => (
              <Card key={highlight.title} className="h-full space-y-4 border border-card-border bg-white/90 p-6 shadow-[0_12px_30px_rgba(0,40,0,0.06)]">
                <highlight.icon className="h-10 w-10 text-accent" />
                <h3 className="text-lg font-semibold text-[#001b00]">{highlight.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{highlight.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="solutions" className="grid gap-10 rounded-[28px] border border-card-border bg-white/85 p-10 shadow-[0_30px_80px_rgba(0,40,0,0.08)]">
          <div className="space-y-4 text-center md:text-left">
            <Badge className="mx-auto bg-[#e0f7e8] text-accent md:mx-0">How we help</Badge>
            <h2 className="text-3xl font-semibold text-[#001b00] md:text-4xl">One platform, multiple ways to get work done</h2>
            <p className="mx-auto max-w-3xl text-lg text-muted md:mx-0">
              Whether you need a solo expert or a dedicated squad, our solution tiers mirror Upwork’s best flows but with local support and curated matches.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {solutions.map((solution) => (
              <Card key={solution.title} className="flex h-full flex-col gap-4 border border-card-border bg-[#f8fdf9] p-6 shadow-none">
                <solution.icon className="h-10 w-10 text-accent" />
                <h3 className="text-lg font-semibold text-[#001b00]">{solution.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-muted">{solution.description}</p>
                <Button asChild variant="secondary" className="w-fit bg-white text-foreground shadow-sm">
                  <Link href={solution.cta.href}>{solution.cta.label}</Link>
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section id="catalog" className="grid gap-6 md:grid-cols-3">
          {catalog.map((item) => (
            <Card key={item.title} className="h-full space-y-3 border border-card-border bg-white p-6 shadow-[0_15px_40px_rgba(0,40,0,0.08)]">
              <Badge className="bg-[#e0f7e8] text-accent">Project Catalog</Badge>
              <h3 className="text-xl font-semibold text-[#001b00]">{item.title}</h3>
              <p className="text-sm text-muted">{item.description}</p>
              <p className="text-sm font-semibold text-[#001b00]">{item.price}</p>
              <Button asChild size="sm">
                <Link href="/signup?role=employer">Start this project</Link>
              </Button>
            </Card>
          ))}
        </section>

        <section id="enterprise" className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6 rounded-[28px] border border-card-border bg-white p-10 shadow-[0_25px_60px_rgba(0,40,0,0.08)]">
            <Badge className="bg-[#001b00] text-white">Why clients choose us</Badge>
            <h2 className="text-3xl font-semibold text-[#001b00] md:text-4xl">Your strategic partner for remote hiring</h2>
            <p className="text-lg text-muted">
              We merge Upwork’s trusted marketplace experience with hands-on service so your teams can move faster, scale smarter, and deliver confidently.
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              {whyClientsChooseUs.map((reason) => (
                <div key={reason.title} className="space-y-3">
                  <reason.icon className="h-8 w-8 text-accent" />
                  <h3 className="text-base font-semibold text-[#001b00]">{reason.title}</h3>
                  <p className="text-sm text-muted">{reason.description}</p>
                </div>
              ))}
            </div>
          </div>
          <Card className="space-y-5 border border-card-border bg-[#001b00] p-10 text-[#d9f5d6] shadow-[0_25px_60px_rgba(0,0,0,0.2)]">
            <Trophy className="h-10 w-10 text-accent" />
            <h3 className="text-3xl font-semibold text-white">“TalentHunt feels like Upwork with a concierge.”</h3>
            <p className="text-sm leading-relaxed text-[#b9e6b4]">
              &ldquo;In just two weeks we staffed engineers, product designers, and content strategists for a brand new initiative. The platform guided every step—contracts, compliance, and payouts—so our team stayed focused on building.&rdquo;
            </p>
            <div className="text-sm text-[#8fd288]">
              <p className="font-semibold text-white">Jamil Khan</p>
              <p>VP of Product, Pathao</p>
            </div>
          </Card>
        </section>

        <section className="space-y-8 text-center">
          <Badge className="mx-auto bg-[#e0f7e8] text-accent">Trusted by leading teams</Badge>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted">
            {trustedLogos.map((logo) => (
              <span key={logo} className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#1b3d1b] shadow-sm">
                {logo}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-10">
          <div className="space-y-4 text-center">
            <Badge className="mx-auto bg-[#001b00] text-white">Client testimonials</Badge>
            <h2 className="text-3xl font-semibold text-[#001b00] md:text-4xl">Stories from teams building with Bangladeshi talent</h2>
            <p className="mx-auto max-w-3xl text-lg text-muted">
              Hear how companies across SaaS, fintech, and e-commerce tap into our marketplace to scale with confidence.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="flex h-full flex-col gap-4 border border-card-border bg-white p-6 shadow-[0_12px_30px_rgba(0,40,0,0.06)]">
                <MessageCircle className="h-8 w-8 text-accent" />
                <p className="flex-1 text-sm leading-relaxed text-muted">{testimonial.quote}</p>
                <div className="space-y-1 text-sm text-[#001b00]">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-muted">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-card-border bg-[#001b00] p-12 text-center text-white shadow-[0_30px_80px_rgba(0,0,0,0.2)]">
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            <Badge className="mx-auto bg-white/10 text-white">Ready to start?</Badge>
            <h2 className="text-4xl font-semibold">Bring world-class Bangladeshi talent onto your team today.</h2>
            <p className="text-lg text-[#c4f2c2]">
              Tell us about your project and receive curated shortlists within 24 hours. From there, collaborate through one seamless, Upwork-inspired workspace.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="bg-white text-[#001b00] hover:bg-white/90">
                <Link href="/signup?role=employer">Start hiring</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild className="bg-transparent text-white hover:bg-white/10">
                <Link href="/contact">Speak with an expert</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

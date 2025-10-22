import Link from "next/link";
import { ArrowRight, Award, BarChart3, Compass, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

const highlights = [
  {
    title: "Personalised onboarding",
    description:
      "Strategy sessions with our success team help you position services, define packages, and set global-ready rates.",
    icon: Compass,
  },
  {
    title: "Showcase-worthy profiles",
    description:
      "Add Upwork-inspired badges, skill verifications, and multimedia case studies to stand out to premium clients.",
    icon: Sparkles,
  },
  {
    title: "Data-backed growth",
    description:
      "Track proposal performance, contract value, and retention so you can scale predictable freelance income.",
    icon: BarChart3,
  },
];

const communityEvents = [
  {
    title: "Portfolio polish clinic",
    description: "Get feedback on your case studies and visual storytelling from award-winning designers in Dhaka.",
    date: "Every Tuesday",
  },
  {
    title: "Pitch practice circle",
    description: "Workshop proposals and discovery calls with top-rated freelancers who close clients internationally.",
    date: "Weekly",
  },
  {
    title: "Founders & freelancers mixer",
    description: "Connect with startups and agencies seeking long-term partners across design, dev, and growth.",
    date: "Monthly",
  },
];

const membershipTiers = [
  {
    name: "Starter",
    price: "Free",
    perks: ["Unlimited proposals", "Secure chat", "Automated invoices"],
  },
  {
    name: "Pro",
    price: "৳1,500/mo",
    perks: ["Priority invites", "Profile audit", "Mentor office hours"],
  },
  {
    name: "Elite",
    price: "৳4,800/mo",
    perks: ["Dedicated success manager", "Quarterly spotlight", "Enterprise access"],
  },
];

export default function TalentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eefaf2] via-white to-[#e6f5eb] text-foreground">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-28 pt-16">
        <section className="grid gap-12 rounded-[32px] border border-card-border bg-white/85 p-10 shadow-[0_24px_80px_rgba(0,40,0,0.1)] md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Badge className="bg-[#001b00] text-white">For freelancers</Badge>
            <h1 className="text-4xl font-semibold leading-tight text-[#001b00] md:text-5xl">
              Grow your freelance business with an Upwork-quality experience tailored for Bangladesh.
            </h1>
            <p className="text-lg text-muted">
              TalentHunt BD gives you polished tools, curated jobs, and expert guidance so you can land premium clients, deliver outstanding work, and get paid on time.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="shadow-[0_12px_30px_rgba(20,168,0,0.25)]">
                <Link href="/signup?role=freelancer">
                  Create your profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="bg-white text-foreground shadow-sm">
                <Link href="/onboarding">Meet the success team</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted">
              <Badge className="bg-[#e0f7e8] text-accent">Bangladeshi payouts</Badge>
              <Badge className="bg-[#e0f7e8] text-accent">US & EU clients</Badge>
              <Badge className="bg-[#e0f7e8] text-accent">Payment protection</Badge>
            </div>
          </div>
          <Card className="space-y-5 border-none bg-gradient-to-br from-[#e6f9ed] via-white to-[#dbf3e4] p-8 shadow-[0_20px_60px_rgba(0,40,0,0.1)]">
            <h2 className="text-lg font-semibold text-[#001b00]">Freelancer spotlight</h2>
            <p className="text-sm leading-relaxed text-muted">
              “I closed three retainer clients within a month. The platform feels like Upwork—just more curated and supportive for Bangladeshi pros.”
            </p>
            <div className="space-y-1 text-sm text-muted">
              <p className="font-semibold text-[#001b00]">Sanika Roy — Brand Strategist</p>
              <p>Top Rated · TalentHunt Elite</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border border-card-border bg-white p-4 text-center shadow-none">
                <p className="text-2xl font-semibold text-[#001b00]">96%</p>
                <p className="text-xs uppercase tracking-wide text-muted">Projects delivered on time</p>
              </Card>
              <Card className="border border-card-border bg-white p-4 text-center shadow-none">
                <p className="text-2xl font-semibold text-[#001b00]">4.9/5</p>
                <p className="text-xs uppercase tracking-wide text-muted">Average client rating</p>
              </Card>
              <Card className="border border-card-border bg-white p-4 text-center shadow-none">
                <p className="text-2xl font-semibold text-[#001b00]">68%</p>
                <p className="text-xs uppercase tracking-wide text-muted">Freelancers earning globally</p>
              </Card>
            </div>
          </Card>
        </section>

        <section className="space-y-10">
          <div className="space-y-4 text-center">
            <Badge className="mx-auto bg-[#e0f7e8] text-accent">All-in-one toolkit</Badge>
            <h2 className="text-3xl font-semibold text-[#001b00] md:text-4xl">Designed to make Bangladeshi talent shine</h2>
            <p className="mx-auto max-w-3xl text-lg text-muted">
              Access the same polished workflows you love on Upwork—plus localised support, payments, and community dedicated to your growth.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((highlight) => (
              <Card key={highlight.title} className="h-full space-y-4 border border-card-border bg-white/90 p-6 shadow-[0_12px_30px_rgba(0,40,0,0.08)]">
                <highlight.icon className="h-10 w-10 text-accent" />
                <h3 className="text-lg font-semibold text-[#001b00]">{highlight.title}</h3>
                <p className="text-sm text-muted">{highlight.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-10 rounded-[28px] border border-card-border bg-white/90 p-10 shadow-[0_24px_60px_rgba(0,40,0,0.08)] md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Badge className="bg-[#001b00] text-white">Community</Badge>
            <h2 className="text-3xl font-semibold text-[#001b00] md:text-4xl">A supportive network to keep you learning</h2>
            <p className="text-lg text-muted">
              Join workshops, peer reviews, and networking sessions crafted specifically for freelancers operating from Bangladesh.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {communityEvents.map((event) => (
                <Card key={event.title} className="space-y-3 border border-card-border bg-[#f7fdf9] p-5 text-left shadow-none">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">{event.date}</p>
                  <h3 className="text-base font-semibold text-[#001b00]">{event.title}</h3>
                  <p className="text-sm text-muted">{event.description}</p>
                </Card>
              ))}
            </div>
          </div>
          <Card className="flex flex-col justify-between gap-6 border border-card-border bg-[#001b00] p-8 text-[#d9f5d6] shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
            <div className="space-y-3">
              <Award className="h-10 w-10 text-accent" />
              <h3 className="text-3xl font-semibold text-white">Top Rated program</h3>
              <p className="text-sm text-[#9bd691]">
                Earn exclusive perks, premium invites, and marketing spotlights when you maintain stellar ratings and on-time delivery.
              </p>
            </div>
            <Button asChild size="md" className="self-start rounded-full bg-white text-[#001b00] hover:bg-white/90">
              <Link href="/freelancers">See featured talent</Link>
            </Button>
          </Card>
        </section>

        <section className="space-y-6 text-center">
          <Badge className="mx-auto bg-[#e0f7e8] text-accent">Memberships</Badge>
          <h2 className="text-3xl font-semibold text-[#001b00] md:text-4xl">Choose the plan that fits your ambition</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {membershipTiers.map((tier) => (
              <Card key={tier.name} className="h-full space-y-4 border border-card-border bg-white p-6 shadow-[0_20px_50px_rgba(0,40,0,0.08)]">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">{tier.name}</p>
                <p className="text-3xl font-semibold text-[#001b00]">{tier.price}</p>
                <ul className="space-y-2 text-sm text-muted">
                  {tier.perks.map((perk) => (
                    <li key={perk}>• {perk}</li>
                  ))}
                </ul>
                <Button asChild variant="secondary" className="w-full bg-[#f7fdf9] text-foreground">
                  <Link href="/signup?role=freelancer">Choose {tier.name.toLowerCase()}</Link>
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-card-border bg-[#001b00] p-12 text-center text-white shadow-[0_30px_80px_rgba(0,0,0,0.2)]">
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            <Badge className="mx-auto bg-white/10 text-white">Ready to level up?</Badge>
            <h2 className="text-4xl font-semibold">Let&apos;s build your most successful freelance year yet.</h2>
            <p className="text-lg text-[#c4f2c2]">
              Join a curated marketplace built for Bangladeshi talent and supported by a team who understands your ambition.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="bg-white text-[#001b00] hover:bg-white/90">
                <Link href="/signup?role=freelancer">Get started</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild className="bg-transparent text-white hover:bg-white/10">
                <Link href="/community">Explore community</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

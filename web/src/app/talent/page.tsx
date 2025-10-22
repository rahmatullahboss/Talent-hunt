import Link from "next/link";
import { BadgeCheck, Globe, LayoutGrid, UsersRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const talentHighlights = [
  {
    title: "Expert-led onboarding",
    description:
      "Get personalized guidance to position your services, set ideal rates, and capture the attention of premium clients.",
    icon: UsersRound,
  },
  {
    title: "Global-ready toolkit",
    description:
      "Access contracts, invoice templates, and proposal builders tailored to Bangladeshi regulations and international standards.",
    icon: Globe,
  },
  {
    title: "Showcase-worthy profiles",
    description:
      "Curate portfolios, add verified skills, and share client success metrics with a clean, modern interface.",
    icon: LayoutGrid,
  },
];

const membershipTiers = [
  {
    name: "Starter",
    price: "Free",
    features: [
      "Unlimited proposals",
      "Secure messaging",
      "Automated invoicing",
    ],
  },
  {
    name: "Pro",
    price: "৳1,200/mo",
    features: [
      "Priority job invites",
      "Profile review with experts",
      "Advanced analytics dashboard",
    ],
  },
  {
    name: "Elite",
    price: "৳4,500/mo",
    features: [
      "Dedicated success manager",
      "Quarterly portfolio spotlight",
      "Access to enterprise engagements",
    ],
  },
];

const successMetrics = [
  { value: "96%", label: "Projects delivered on time" },
  { value: "4.9/5", label: "Average freelancer rating" },
  { value: "68%", label: "Freelancers earning internationally" },
];

export default function TalentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-[#f4fbf8] to-white">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-24 pt-16">
        <header className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div className="space-y-6">
            <Badge className="w-fit bg-white text-accent">Build your light-mode headquarters</Badge>
            <h1 className="text-4xl font-semibold text-foreground md:text-5xl">
              Stand out on the premier Bangladeshi freelance marketplace.
            </h1>
            <p className="text-lg text-muted">
              TalentHunt BD gives you a polished, Upwork-inspired experience with localized tools, curated opportunities, and concierge support.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signup?role=freelancer">Create your profile</Link>
              </Button>
              <Button asChild variant="secondary" className="bg-white text-foreground">
                <Link href="/onboarding">Meet the success team</Link>
              </Button>
            </div>
          </div>
          <Card className="space-y-6 border border-card-border bg-white/90 p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-foreground">Freelancer spotlight</h2>
            <p className="text-sm text-muted">
              &ldquo;I closed three long-term retainers through TalentHunt BD in under a month because the platform surfaces exactly the work I want.&rdquo;
            </p>
            <div className="flex items-center gap-3 text-sm text-muted">
              <BadgeCheck className="h-5 w-5 text-accent" />
              <span>Sanika Roy — Brand Strategist</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {successMetrics.map((metric) => (
                <div key={metric.label}>
                  <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
                  <p className="text-xs text-muted">{metric.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </header>

        <section className="space-y-10">
          <header className="space-y-4 text-center">
            <Badge className="mx-auto bg-white text-accent">All-in-one toolkit</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Designed for the way you work</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              From proposal to payout, every interaction feels clean, transparent, and supportive—just like the best light theme experiences.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {talentHighlights.map((feature) => (
              <Card key={feature.title} className="h-full space-y-4 border border-card-border bg-white/95 p-6 shadow-sm">
                <feature.icon className="h-10 w-10 text-accent" />
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6 rounded-[var(--radius-lg)] border border-card-border bg-gradient-to-br from-emerald-500/10 via-white to-emerald-50 p-10 shadow-lg">
          <div className="flex flex-col gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-foreground md:text-4xl">Memberships built to accelerate your journey</h2>
              <p className="text-lg text-muted">
                Start free, then unlock growth perks such as instant job invites, analytics, and mentorship with our local experts.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/signup?role=freelancer">Compare plans</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {membershipTiers.map((tier) => (
              <Card key={tier.name} className="h-full space-y-4 border border-card-border bg-white/95 p-6 shadow-md">
                <p className="text-sm font-semibold uppercase tracking-wide text-accent">{tier.name}</p>
                <p className="text-3xl font-semibold text-foreground">{tier.price}</p>
                <ul className="space-y-2 text-sm text-muted">
                  {tier.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
                <Button asChild variant="secondary" className="bg-white text-foreground">
                  <Link href="/signup?role=freelancer">Choose {tier.name.toLowerCase()}</Link>
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6 text-center">
          <h2 className="text-3xl font-semibold text-foreground md:text-4xl">Level up with guidance from people who get it</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted">
            Join weekly workshops, portfolio reviews, and community sessions hosted by Bangladesh’s top freelancers and agency leaders.
          </p>
          <Button asChild size="lg" className="mx-auto">
            <Link href="/community">Explore events</Link>
          </Button>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

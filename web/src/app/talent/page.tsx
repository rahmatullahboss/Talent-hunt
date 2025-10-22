import Link from "next/link";
import {
  Award,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  Compass,
  Flame,
  Globe,
  Handshake,
  LayoutGrid,
  Search,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const spotlightTalent = [
  {
    name: "Sanika Roy",
    title: "Brand & Product Strategist",
    rating: "Top Rated Plus",
    skills: ["Brand systems", "Campaign leadership", "Go-to-market"],
  },
  {
    name: "Ayaan Haque",
    title: "Senior Full-stack Engineer",
    rating: "Rising Talent",
    skills: ["Next.js", "NestJS", "Supabase", "Microservices"],
  },
  {
    name: "Mehnaz Islam",
    title: "Growth Marketing Lead",
    rating: "Expert-Vetted",
    skills: ["Lifecycle", "Paid social", "Automation"],
  },
];

const categories = [
  {
    title: "Development & Tech",
    description: "Engineers, QA, DevOps, data experts",
    icon: Sparkles,
  },
  {
    title: "Design & Creative",
    description: "Product, brand, illustration, motion",
    icon: LayoutGrid,
  },
  {
    title: "Sales & Marketing",
    description: "Growth leads, performance strategists",
    icon: Flame,
  },
  {
    title: "Writing & Translation",
    description: "UX writers, researchers, localization",
    icon: Compass,
  },
  {
    title: "Finance & Operations",
    description: "Controllers, HR, business ops, legal",
    icon: Briefcase,
  },
  {
    title: "Customer Success",
    description: "Account managers, support leaders",
    icon: UsersRound,
  },
];

const assurances = [
  {
    title: "Curated Bangladeshi talent",
    description:
      "We personally vet every freelancer on communication, delivery history, and domain expertise—mirroring Upwork’s top tiers.",
    icon: BadgeCheck,
  },
  {
    title: "Seamless onboarding",
    description:
      "From NDAs to compliance paperwork, our team handles the admin so you can focus on building the right team.",
    icon: Handshake,
  },
  {
    title: "Global collaboration ready",
    description:
      "Every freelancer is fluent in remote-first tools, async rituals, and timezone collaboration.",
    icon: Globe,
  },
];

const milestones = [
  {
    title: "Pitch-perfect profiles",
    description:
      "Beautiful Upwork-style profiles with testimonials, case studies, and rate guidance help you evaluate talent in minutes.",
    icon: Award,
  },
  {
    title: "Outcome-driven engagements",
    description:
      "Milestones, agile boards, and transparent reporting keep projects aligned from discovery to delivery.",
    icon: CheckCircle2,
  },
  {
    title: "Long-term partnerships",
    description:
      "Scale from project-based work to retainers with ease. Stay within TalentHunt and keep support close at hand.",
    icon: Briefcase,
  },
];

export default function TalentPage() {
  return (
    <div className="min-h-screen bg-[#f2f7f2] text-[#001e00]">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-24 pt-16">
        <header className="grid gap-12 rounded-[32px] bg-white/90 p-10 shadow-[0_24px_64px_rgba(0,30,0,0.08)] md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-6">
            <Badge className="w-fit bg-[#dff4df] text-accent">Find Bangladeshi freelancers like you do on Upwork</Badge>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Discover elite independents ready for your next sprint.
            </h1>
            <p className="text-lg text-[#335c3b]">
              Search curated profiles, invite Top Rated experts, and collaborate with confidence thanks to escrow protection,
              transparent reviews, and local success managers.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signup?role=freelancer">Create your freelancer profile</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="bg-white text-[#001e00] shadow-sm">
                <Link href="/signup?role=employer">Post a job for free</Link>
              </Button>
            </div>
          </div>
          <Card className="space-y-5 border border-card-border bg-white/95 p-6 shadow-sm">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#001e00]" htmlFor="talent-search">
                Search for a skill or role
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5a7a5f]" />
                <Input
                  id="talent-search"
                  placeholder="Try “UI/UX designer” or “Full-stack developer”"
                  className="h-12 rounded-2xl border-[#d8e8d8] bg-[#f7fdf7] pl-10 text-sm text-[#001e00]"
                  readOnly
                />
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#5a7a5f]">Spotlight freelancers</p>
              <div className="space-y-4">
                {spotlightTalent.map((talent) => (
                  <div key={talent.name} className="rounded-2xl border border-[#d8e8d8] bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#001e00]">{talent.name}</p>
                        <p className="text-xs text-[#5a7a5f]">{talent.title}</p>
                      </div>
                      <Badge className="bg-[#ecf8ec] text-accent">{talent.rating}</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {talent.skills.map((skill) => (
                        <span key={skill} className="rounded-full bg-[#f7fdf7] px-3 py-1 text-xs text-[#335c3b]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button asChild size="lg" className="w-full">
              <Link href="/signup?role=employer">Invite these freelancers</Link>
            </Button>
          </Card>
        </header>

        <section className="space-y-10">
          <header className="space-y-4 text-center">
            <Badge className="mx-auto bg-[#dff4df] text-accent">Top categories</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Start with battle-tested experts</h2>
            <p className="mx-auto max-w-2xl text-lg text-[#335c3b]">
              Explore high-performing categories crafted to reflect Upwork’s marketplace, with a focus on Bangladeshi excellence.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.title} className="h-full space-y-3 border border-card-border bg-white/90 p-6 shadow-sm">
                <category.icon className="h-8 w-8 text-accent" />
                <h3 className="text-lg font-semibold">{category.title}</h3>
                <p className="text-sm text-[#335c3b]">{category.description}</p>
                <Button asChild variant="link" className="px-0 text-accent">
                  <Link href="/signup?role=employer">View available talent</Link>
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-10 rounded-[32px] bg-white/90 p-10 shadow-[0_20px_48px_rgba(0,30,0,0.06)] md:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <Badge className="bg-[#dff4df] text-accent">Why teams hire here</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Enterprise-grade confidence, freelancer-first experience</h2>
            <p className="text-lg text-[#335c3b]">
              Built to mirror the Upwork flow you already know, but with deeper vetting, local billing options, and a community-first ethos.
            </p>
            <Button asChild size="lg" className="w-fit">
              <Link href="/onboarding">Talk to a talent advisor</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {assurances.map((item) => (
              <Card key={item.title} className="flex items-start gap-4 border border-card-border bg-white/95 p-5 shadow-sm">
                <item.icon className="mt-1 h-6 w-6 text-accent" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-[#335c3b]">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-10">
          <header className="space-y-4 text-center">
            <Badge className="mx-auto bg-[#dff4df] text-accent">Work your way</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Designed to help freelancers shine</h2>
            <p className="mx-auto max-w-2xl text-lg text-[#335c3b]">
              From polished profiles to milestone tracking, we provide everything you need to deliver confidently and grow sustainably.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {milestones.map((milestone) => (
              <Card key={milestone.title} className="h-full space-y-3 border border-card-border bg-white/90 p-6 shadow-sm">
                <milestone.icon className="h-8 w-8 text-accent" />
                <h3 className="text-lg font-semibold">{milestone.title}</h3>
                <p className="text-sm text-[#335c3b]">{milestone.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-transparent bg-gradient-to-r from-[#dff4df] via-[#b9ebc0] to-[#f0fff0] p-10 text-center shadow-[0_20px_48px_rgba(0,30,0,0.06)]">
          <div className="mx-auto max-w-3xl space-y-4">
            <h2 className="text-3xl font-semibold md:text-4xl">Build your dream roster today</h2>
            <p className="text-lg text-[#335c3b]">
              Browse the very best of Bangladesh, invite the perfect fit, and start collaborating under the safety of escrow-backed contracts.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/signup?role=employer">Find freelancers</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="bg-white text-[#001e00] shadow-sm">
                <Link href="/signup?role=freelancer">Become a freelancer</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

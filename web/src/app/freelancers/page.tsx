import Link from "next/link";
import { ArrowRight, Star, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

const freelancers = [
  {
    name: "Zara Haque",
    title: "Senior Product Designer",
    rating: "4.9",
    reviews: 128,
    rate: "৳2,500/hr",
    tags: ["Fintech", "Design systems", "Motion"],
    description:
      "Crafts polished, conversion-friendly experiences for SaaS, fintech, and e-commerce brands with data-backed decisions.",
  },
  {
    name: "Farhan Ahmed",
    title: "Full-stack Engineer",
    rating: "5.0",
    reviews: 142,
    rate: "৳2,800/hr",
    tags: ["Next.js", "TypeScript", "Supabase"],
    description:
      "Builds end-to-end platforms with modern architectures, automated testing, and scalable infrastructure planning.",
  },
  {
    name: "Sanika Roy",
    title: "Brand Strategist",
    rating: "4.8",
    reviews: 98,
    rate: "৳1,900/hr",
    tags: ["Brand voice", "Campaigns", "Content"],
    description:
      "Shapes magnetic narratives and campaign systems that help startups stand out in crowded global markets.",
  },
  {
    name: "Rahim Chowdhury",
    title: "Data & Analytics Consultant",
    rating: "4.9",
    reviews: 87,
    rate: "৳3,100/hr",
    tags: ["SQL", "dbt", "Looker"],
    description:
      "Turns scattered product and marketing data into automated dashboards and actionable insights for executive teams.",
  },
  {
    name: "Nusrat Jahan",
    title: "Marketing Automation Lead",
    rating: "4.8",
    reviews: 110,
    rate: "৳2,200/hr",
    tags: ["HubSpot", "Lifecycle", "Paid media"],
    description:
      "Launches multi-channel funnels with personalised messaging and crisp reporting for SaaS and marketplace companies.",
  },
  {
    name: "Imran Hossain",
    title: "Customer Success Manager",
    rating: "5.0",
    reviews: 74,
    rate: "৳1,500/hr",
    tags: ["B2B SaaS", "Playbooks", "Support"],
    description:
      "Keeps enterprise clients delighted with proactive playbooks, onboarding strategies, and success metrics that matter.",
  },
];

export default function FreelancersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#edf9f0] via-white to-[#e6f5eb] text-foreground">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-28 pt-16">
        <section className="space-y-6 text-center">
          <Badge className="mx-auto bg-[#001b00] text-white">Find freelancers</Badge>
          <h1 className="text-4xl font-semibold text-[#001b00] md:text-5xl">
            Meet Bangladesh&apos;s top Upwork-quality freelancers, curated for you.
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-muted">
            Browse featured experts or tell us what you&apos;re building. Our team will assemble shortlists within 24 hours, ready to collaborate through one secure workspace.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="shadow-[0_12px_30px_rgba(20,168,0,0.25)]">
              <Link href="/signup?role=employer">
                Post a job
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild className="bg-white text-foreground shadow-sm">
              <Link href="/contact">Get matched by our team</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {freelancers.map((freelancer) => (
            <Card key={freelancer.name} className="flex h-full flex-col gap-4 border border-card-border bg-white p-6 shadow-[0_18px_50px_rgba(0,40,0,0.08)]">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#001b00]">{freelancer.name}</h2>
                  <p className="text-sm text-muted">{freelancer.title}</p>
                </div>
                <Badge className="flex items-center gap-1 bg-[#e0f7e8] text-accent">
                  <Star className="h-4 w-4" /> {freelancer.rating} ({freelancer.reviews})
                </Badge>
              </div>
              <p className="text-sm leading-relaxed text-muted">{freelancer.description}</p>
              <div className="flex flex-wrap gap-2">
                {freelancer.tags.map((tag) => (
                  <Badge key={tag} className="rounded-full bg-[#f7fdf9] px-3 py-1 text-sm text-foreground">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-card-border pt-4 text-sm text-muted">
                <span className="font-semibold text-[#001b00]">{freelancer.rate}</span>
                <Button asChild size="sm" className="rounded-full px-5">
                  <Link href="/signup?role=employer">Invite to job</Link>
                </Button>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-10 rounded-[28px] border border-card-border bg-white/90 p-10 shadow-[0_24px_70px_rgba(0,40,0,0.1)] md:grid-cols-[1fr_1fr]">
          <div className="space-y-5">
            <Badge className="bg-[#e0f7e8] text-accent">Why it works</Badge>
            <h2 className="text-3xl font-semibold text-[#001b00] md:text-4xl">Global-quality process with local partnership</h2>
            <p className="text-lg text-muted">
              TalentHunt mirrors Upwork’s trusted hiring journey while adding local expertise, compliance, and concierge support.
            </p>
            <ul className="space-y-3 text-sm text-muted">
              <li>• Dedicated talent partners refine briefs and curate shortlists.</li>
              <li>• Escrow-backed payments, milestone reviews, and weekly updates ensure transparency.</li>
              <li>• Support for contracts, NDAs, and compliance tailored to Bangladesh-based experts.</li>
            </ul>
            <Button asChild size="md" className="w-fit rounded-full">
              <Link href="/contact">Talk to a hiring specialist</Link>
            </Button>
          </div>
          <Card className="flex flex-col justify-between gap-6 border border-card-border bg-[#001b00] p-8 text-[#d9f5d6] shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
            <div className="space-y-3">
              <UsersRound className="h-10 w-10 text-accent" />
              <h3 className="text-3xl font-semibold text-white">Build your remote dream team</h3>
              <p className="text-sm text-[#9bd691]">
                From single specialists to dedicated squads, we connect you with Bangladeshi talent ready for global collaboration.
              </p>
            </div>
            <Button asChild variant="secondary" className="self-start rounded-full bg-white text-[#001b00]">
              <Link href="/signup?role=employer">Start hiring today</Link>
            </Button>
          </Card>
        </section>

        <section className="rounded-[28px] border border-card-border bg-[#001b00] p-12 text-center text-white shadow-[0_30px_80px_rgba(0,0,0,0.2)]">
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            <Badge className="mx-auto bg-white/10 text-white">Need a custom shortlist?</Badge>
            <h2 className="text-4xl font-semibold">Share your brief and we&apos;ll assemble talent within 24 hours.</h2>
            <p className="text-lg text-[#c4f2c2]">
              You&apos;ll receive curated profiles, availability, and pricing, then collaborate in a secure, Upwork-inspired workspace built for teams.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="bg-white text-[#001b00] hover:bg-white/90">
                <Link href="/signup?role=employer">Submit your brief</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild className="bg-transparent text-white hover:bg-white/10">
                <Link href="/contact">Schedule a call</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

import Link from "next/link";
import { BadgeCheck, Clock, Filter, MapPin, Search, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

const filters = [
  "Development & IT",
  "Design & Creative",
  "Sales & Marketing",
  "Customer Support",
  "Finance & Admin",
  "Engineering",
  "Data & AI",
  "Product & Project",
];

const jobs = [
  {
    title: "Senior React Engineer for Fintech Dashboard",
    company: "Finix Labs",
    location: "Dhaka · Remote friendly",
    rate: "৳2,100/hr",
    type: "Hourly",
    badges: ["Top Rated", "Verified client"],
    description:
      "Collaborate with a cross-functional squad to build real-time analytics dashboards using Next.js, Tailwind, and Supabase.",
    responseTime: "Responds in 6 hours",
  },
  {
    title: "Product Designer for Super App Redesign",
    company: "Aurora Health",
    location: "Chittagong · Remote",
    rate: "৳135k/mo",
    type: "Monthly retainer",
    badges: ["Hiring fast", "Global team"],
    description:
      "Lead end-to-end UX research, UI design, and motion prototypes for an accessible telemedicine platform serving South Asia.",
    responseTime: "Responds in 12 hours",
  },
  {
    title: "Marketing Automation Strategist",
    company: "iFarmer",
    location: "Dhaka",
    rate: "৳1,600/hr",
    type: "Hourly",
    badges: ["TalentHunt Pro", "Featured"],
    description:
      "Plan and optimise omnichannel campaigns, build lifecycle automations, and deliver weekly performance insights.",
    responseTime: "Responds in 8 hours",
  },
  {
    title: "Customer Success Associate (SaaS)",
    company: "SaaSly",
    location: "Remote",
    rate: "৳90k/mo",
    type: "Monthly",
    badges: ["Long-term", "English required"],
    description:
      "Support enterprise customers, run onboarding calls, and maintain playbooks with HubSpot and Intercom workflows.",
    responseTime: "Responds in 10 hours",
  },
];

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#edf9f0] via-white to-[#e6f5eb] text-foreground">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-24 pt-16">
        <header className="grid gap-10 rounded-[32px] border border-card-border bg-white/90 p-10 shadow-[0_24px_80px_rgba(0,40,0,0.1)] md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <Badge className="bg-[#001b00] text-white">Find work you love</Badge>
            <h1 className="text-4xl font-semibold leading-tight text-[#001b00] md:text-5xl">
              Discover premium opportunities inspired by Upwork’s best experiences.
            </h1>
            <p className="text-lg text-muted">
              Our curated job board highlights vetted clients, transparent budgets, and remote-friendly teams hiring across Bangladesh and beyond.
            </p>
            <div className="relative flex items-center gap-3 rounded-full border border-card-border bg-white px-6 py-4 shadow-sm">
              <Search className="h-5 w-5 text-muted" />
              <input
                className="h-6 w-full border-0 bg-transparent text-sm text-muted focus-visible:outline-none"
                placeholder="Search by skill, title, or company"
              />
              <Button size="sm" className="rounded-full px-5">
                Search jobs
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <Badge className="bg-[#e0f7e8] text-accent">No bidding wars</Badge>
              <Badge className="bg-[#e0f7e8] text-accent">Payment protection</Badge>
              <Badge className="bg-[#e0f7e8] text-accent">Dedicated success team</Badge>
            </div>
          </div>
          <Card className="space-y-5 border-none bg-gradient-to-br from-[#e6f8ed] via-white to-[#dbf3e4] p-8 shadow-[0_24px_60px_rgba(0,40,0,0.12)]">
            <h2 className="text-lg font-semibold text-[#001b00]">Why talent love TalentHunt</h2>
            <div className="space-y-4 text-sm text-muted">
              <p className="flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-accent" /> Verified clients with clear scopes and budgets
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" /> Average response time under 12 hours
              </p>
              <p className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent" /> Top talent earn 40% more with long-term retainers
              </p>
            </div>
            <Button asChild size="md" className="rounded-full">
              <Link href="/signup?role=freelancer">Upgrade your profile</Link>
            </Button>
          </Card>
        </header>

        <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="space-y-6">
            <Card className="space-y-4 border border-card-border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-[#001b00]">Browse by category</h2>
                <Filter className="h-5 w-5 text-muted" />
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <Badge key={filter} className="rounded-full bg-[#f0fbf4] px-3 py-1 text-sm text-foreground">
                    {filter}
                  </Badge>
                ))}
              </div>
            </Card>
            <Card className="space-y-4 border border-card-border bg-gradient-to-br from-[#001b00] via-[#003a01] to-[#001b00] p-6 text-[#d9f5d6] shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
              <h3 className="text-lg font-semibold text-white">Get noticed faster</h3>
              <p className="text-sm text-[#9bd691]">
                Add verified skills, upload case studies, and request portfolio reviews to climb shortlists curated by our success partners.
              </p>
              <Button asChild variant="secondary" className="w-fit bg-white text-[#001b00]">
                <Link href="/onboarding">Book a strategy session</Link>
              </Button>
            </Card>
          </aside>

          <div className="space-y-5">
            {jobs.map((job) => (
              <Card key={job.title} className="space-y-4 border border-card-border bg-white p-6 shadow-[0_12px_40px_rgba(0,40,0,0.08)]">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-[#001b00]">{job.title}</h3>
                    <p className="text-sm text-muted">{job.company}</p>
                    <div className="flex flex-wrap gap-2">
                      {job.badges.map((badge) => (
                        <Badge key={badge} className="bg-[#e0f7e8] text-accent">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2 text-sm text-muted sm:flex-row sm:items-center">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-4 w-4 text-accent" /> {job.type}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-accent" /> {job.location}
                    </span>
                    <span className="font-semibold text-[#001b00]">{job.rate}</span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted">{job.description}</p>
                <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">{job.responseTime}</p>
                  <Button size="sm" asChild className="rounded-full px-5">
                    <Link href="/signup?role=freelancer">Submit proposal</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

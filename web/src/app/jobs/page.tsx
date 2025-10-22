import Link from "next/link";
import { Clock, MapPin, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const jobs = [
  {
    title: "Senior React Developer",
    company: "Finix Labs",
    location: "Dhaka • Remote friendly",
    rate: "৳2,000/hr",
    type: "Hourly",
    tags: ["React", "TypeScript", "Tailwind"],
    description: "Build financial dashboards for SME clients with a cross-functional product squad.",
  },
  {
    title: "Product Designer",
    company: "Aurora Health",
    location: "Chittagong • Remote",
    rate: "৳120k/mo",
    type: "Fixed",
    tags: ["Figma", "Design systems", "UX"],
    description: "Redesign telemedicine flows with a focus on accessibility and multilingual support.",
  },
  {
    title: "Growth Marketing Strategist",
    company: "iFarmer",
    location: "Dhaka",
    rate: "৳1,500/hr",
    type: "Hourly",
    tags: ["Performance", "Automation", "Analytics"],
    description: "Plan and optimize omni-channel campaigns for agri-tech expansion across Bangladesh.",
  },
  {
    title: "Customer Success Associate",
    company: "SaaSly",
    location: "Remote",
    rate: "৳85k/mo",
    type: "Fixed",
    tags: ["Support", "CRM", "English"],
    description: "Provide white-glove onboarding and support for enterprise SaaS customers in APAC.",
  },
];

const filters = [
  "Development & IT",
  "Design & Creative",
  "Sales & Marketing",
  "Writing & Translation",
  "Customer Support",
  "Finance & Admin",
];

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-[#f4fbf8] to-white">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-16">
        <header className="space-y-6 text-center">
          <Badge className="mx-auto bg-white text-accent">Find work you love</Badge>
          <h1 className="text-4xl font-semibold text-foreground md:text-5xl">Curated opportunities for Bangladeshi talent</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted">
            Browse a light, Upwork-inspired job board featuring vetted clients, transparent rates, and quick response times.
          </p>
          <div className="relative mx-auto flex max-w-xl items-center rounded-[var(--radius-lg)] border border-card-border bg-white p-3 shadow-sm">
            <Search className="mr-3 h-5 w-5 text-muted" />
            <input
              className="w-full border-0 text-sm focus-visible:outline-none"
              placeholder="Search by skill, title, or company"
            />
            <Button className="ml-3 shrink-0" size="md">
              Search jobs
            </Button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <aside className="space-y-6">
            <Card className="space-y-4 border border-card-border bg-white/90 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">Popular categories</h2>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <Badge key={filter} className="bg-emerald-50 text-foreground">
                    {filter}
                  </Badge>
                ))}
              </div>
            </Card>
            <Card className="space-y-4 border border-card-border bg-gradient-to-br from-emerald-500/10 via-white to-emerald-50 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-accent" />
                <h3 className="text-base font-semibold text-foreground">Pro Tip</h3>
              </div>
              <p className="text-sm text-muted">
                Complete your profile and add verified badges to move to the top of shortlists curated by our success team.
              </p>
              <Button asChild variant="secondary" className="bg-white text-foreground">
                <Link href="/onboarding">Upgrade profile</Link>
              </Button>
            </Card>
          </aside>

          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.title} className="space-y-4 border border-card-border bg-white/95 p-6 shadow-md">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                    <p className="text-sm text-muted">{job.company}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-4 w-4 text-accent" /> {job.type}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-accent" /> {job.location}
                    </span>
                    <span className="font-semibold text-foreground">{job.rate}</span>
                  </div>
                </div>
                <p className="text-sm text-muted">{job.description}</p>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge key={tag} className="bg-accent/10 text-accent">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted">
                    Verified client · Avg. response time 12h · Protected payout
                  </p>
                  <Button size="sm" asChild>
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

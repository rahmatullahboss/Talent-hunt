import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Clock,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const heroStats = [
  { value: "6K+", label: "Verified clients hiring now" },
  { value: "৳1.2L", label: "Median project value" },
  { value: "24h", label: "Average response time" },
];

const quickFilters = [
  "Remote friendly",
  "Hourly",
  "Fixed budget",
  "Design",
  "Development",
  "Marketing",
];

const spotlightJobs = [
  {
    title: "Senior React Developer",
    company: "Finix Labs",
    location: "Dhaka • Remote friendly",
    rate: "৳2,000/hr",
    type: "Hourly",
    tags: ["React", "TypeScript", "Tailwind"],
    description:
      "Build financial dashboards for SME clients with a cross-functional product squad.",
    posted: "Posted 2h ago",
    proposals: "8 active proposals",
    clientScore: "4.9/5 client rating",
  },
  {
    title: "Product Designer",
    company: "Aurora Health",
    location: "Chittagong • Remote",
    rate: "৳120k/mo",
    type: "Fixed",
    tags: ["Figma", "Design systems", "UX"],
    description:
      "Redesign telemedicine flows with a focus on accessibility and multilingual support.",
    posted: "Posted yesterday",
    proposals: "Shortlisting now",
    clientScore: "Top client • 60 hires",
  },
  {
    title: "Growth Marketing Strategist",
    company: "iFarmer",
    location: "Dhaka",
    rate: "৳1,500/hr",
    type: "Hourly",
    tags: ["Performance", "Automation", "Analytics"],
    description:
      "Plan and optimize omni-channel campaigns for agri-tech expansion across Bangladesh.",
    posted: "Posted 4h ago",
    proposals: "Reviewing 5 matches",
    clientScore: "Verified payments",
  },
  {
    title: "Customer Success Associate",
    company: "SaaSly",
    location: "Remote",
    rate: "৳85k/mo",
    type: "Fixed",
    tags: ["Support", "CRM", "English"],
    description:
      "Provide white-glove onboarding and support for enterprise SaaS customers in APAC.",
    posted: "Posted 1d ago",
    proposals: "Interviewing",
    clientScore: "Protected payout",
  },
];

const successHighlights = [
  {
    title: "Vetted clients & clear briefs",
    description:
      "Every job is reviewed by our success team for scope, budget, and communication quality before it reaches you.",
    icon: ShieldCheck,
  },
  {
    title: "Local payouts, global brands",
    description:
      "Work with startups and scale-ups who pay securely in BDT with escrow support and transparent milestones.",
    icon: TrendingUp,
  },
  {
    title: "Stand out with badges",
    description:
      "Complete profile verifications and earn badges that boost your visibility in curated shortlists.",
    icon: BadgeCheck,
  },
];

const applicationSteps = [
  {
    title: "Discover matched briefs",
    description:
      "Use smart filters or rely on curated recommendations tailored to your skills, rate, and availability.",
    icon: Search,
    step: "01",
  },
  {
    title: "Connect with clients fast",
    description:
      "Message clients directly, share tailored proposals, and track replies from your unified inbox.",
    icon: MessageCircle,
    step: "02",
  },
  {
    title: "Start with confidence",
    description:
      "Kick off projects with milestone-based contracts, verified payouts, and success managers on standby.",
    icon: CalendarCheck,
    step: "03",
  },
];

const testimonials = [
  {
    quote:
      "I closed my first three TalentHunt contracts within a month. The clients were responsive and payments hit my account on time.",
    name: "Shammi Akter",
    role: "Product Designer",
  },
  {
    quote:
      "The brief quality is so much better than other platforms. I spend less time bidding and more time delivering work I love.",
    name: "Tanvir Hasan",
    role: "Full-stack Developer",
  },
  {
    quote:
      "Having a local success team means I always have someone to escalate to. It feels premium without the international hassle.",
    name: "Mehnaz Rahman",
    role: "Marketing Strategist",
  },
];

export default function JobsPage() {
  return (
    <div className="min-h-screen text-foreground">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-24 pt-12">
        <section className="grid gap-12 rounded-[32px] bg-white/90 p-10 shadow-[0_24px_64px_rgba(0,30,0,0.08)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <Badge className="w-fit bg-accent/15 text-accent">Bangladesh’s Upwork-style marketplace</Badge>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Find work that fits your craft.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted md:text-xl">
              Access vetted jobs from trusted Bangladeshi and global teams. Showcase your expertise, get matched fast, and get paid securely in BDT.
            </p>
            <div className="space-y-4">
              <div className="relative flex items-center rounded-[24px] border border-card-border bg-white/90 p-4 shadow-sm">
                <Search className="mr-3 h-5 w-5 text-muted" />
                <input
                  className="w-full border-0 bg-transparent text-sm text-foreground placeholder:text-muted/70 focus-visible:outline-none"
                  placeholder="Search by skill, title, or company"
                />
                <Button size="lg" className="ml-3 shrink-0">
                  Search jobs
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted">
                <span className="font-semibold uppercase tracking-wide text-foreground">Quick filters</span>
                {quickFilters.map((filter) => (
                  <Badge key={filter} className="bg-accent/10 px-3 py-1 text-xs font-medium text-foreground">
                    {filter}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid gap-6 text-sm text-muted sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="space-y-1 rounded-2xl bg-foreground/5 p-4 shadow-sm">
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-[#f0fff0] via-white to-[#dff4df] p-8 shadow-none">
            <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[#c1f2c1]/40 blur-3xl" aria-hidden />
            <div className="relative space-y-6">
              <div className="rounded-3xl bg-white/90 p-6 shadow-[0_20px_40px_rgba(0,30,0,0.08)]">
                <div className="flex items-center justify-between text-xs font-medium text-muted">
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" /> Featured contract
                  </span>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-accent">৳ 2,40,000 project</span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-muted">
                  <p className="text-foreground">Product Designer for fintech superapp</p>
                  <div className="flex items-center gap-2 text-xs text-muted/90">
                    <Star className="h-4 w-4 fill-accent text-accent" /> 5.0 client rating
                  </div>
                  <p>Dhaka • Hybrid • Motion & Design systems</p>
                </div>
              </div>
              <div className="rounded-3xl bg-white/90 p-6 shadow-[0_20px_40px_rgba(0,30,0,0.06)]">
                <p className="text-sm font-medium text-foreground">“TalentHunt sent me a shortlist of dream projects that matched my portfolio perfectly.”</p>
                <p className="mt-4 text-xs text-muted">— Rafi Khan, UX Lead</p>
              </div>
              <div className="flex items-center gap-4 rounded-3xl bg-white/90 p-4 shadow-[0_12px_24px_rgba(0,30,0,0.05)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                  SR
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Samiha Rahman</p>
                  <p className="text-xs text-muted">Top Rated • Brand Strategist</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="space-y-12">
          <header className="space-y-4 text-center">
            <Badge className="mx-auto bg-accent/15 text-accent">Why talent choose TalentHunt</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">A job marketplace that feels like Upwork, tuned for Bangladesh</h2>
            <p className="mx-auto max-w-3xl text-lg text-muted">
              We combine curated clients, local payouts, and hands-on support so you can focus on delivering great work—not chasing it.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {successHighlights.map((item) => (
              <Card key={item.title} className="h-full space-y-4 border border-card-border bg-white/90 p-6 shadow-sm">
                <item.icon className="h-10 w-10 text-accent" />
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted">{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-10 rounded-[32px] bg-white/90 p-10 shadow-[0_20px_48px_rgba(0,30,0,0.06)] lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-6">
            <Badge className="bg-accent/15 text-accent">Opportunities curated for you</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Spotlight contracts live right now</h2>
            <p className="text-lg text-muted">
              Browse ready-to-apply roles with transparent budgets, clear scopes, and clients who respond quickly.
            </p>
            <Button asChild size="lg" className="mt-2 w-fit">
              <Link href="/signup?role=freelancer">Create your freelancer profile</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {spotlightJobs.map((job) => (
              <Card key={job.title} className="space-y-4 border border-card-border bg-white/95 p-6 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">{job.title}</h3>
                    <p className="text-sm text-muted">{job.company}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
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
                    <Badge key={tag} className="bg-accent/10 text-foreground">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-col gap-2 text-xs text-muted md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span>{job.posted}</span>
                    <span>{job.proposals}</span>
                    <span>{job.clientScore}</span>
                  </div>
                  <Button size="sm" asChild>
                    <Link href="/signup?role=freelancer">Submit proposal</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-12 rounded-[32px] bg-white/90 p-10 shadow-[0_20px_48px_rgba(0,30,0,0.06)] md:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <Badge className="bg-accent/15 text-accent">How it works</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Land your next project in three steps</h2>
            <p className="text-lg text-muted">
              Mirror the Upwork experience with local advantages—guided onboarding, verified payouts, and client introductions when you shine.
            </p>
            <Button asChild variant="secondary" size="lg" className="bg-card text-foreground shadow-sm">
              <Link href="/onboarding">Complete your profile</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {applicationSteps.map((step) => (
              <Card key={step.title} className="flex items-start gap-4 border border-card-border bg-white/95 p-5 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold text-accent">
                  {step.step}
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

        <section className="grid gap-10 rounded-[32px] bg-white/90 p-10 shadow-[0_20px_48px_rgba(0,30,0,0.06)] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <Badge className="bg-accent/15 text-accent">Proof from top freelancers</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Hear from talent thriving on TalentHunt</h2>
            <p className="text-lg text-muted">
              Freelancers across design, development, marketing, and operations trust TalentHunt to deliver consistent, high-quality work.
            </p>
            <Button asChild size="lg" variant="secondary" className="bg-card text-foreground shadow-sm">
              <Link href="/talent">View success stories</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="space-y-3 border border-card-border bg-white/95 p-6 shadow-sm">
                <p className="text-sm text-foreground">“{testimonial.quote}”</p>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted">{testimonial.name}</div>
                <p className="text-xs text-muted">{testimonial.role}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-transparent bg-gradient-to-r from-[#dff4df] via-[#b9ebc0] to-[#f0fff0] p-10 text-center shadow-[0_20px_48px_rgba(0,30,0,0.06)]">
          <div className="mx-auto max-w-3xl space-y-4">
            <h2 className="text-3xl font-semibold md:text-4xl">Ready to land your next contract?</h2>
            <p className="text-lg text-muted">
              Build your TalentHunt profile, verify your skills, and start receiving curated opportunities within days.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/signup?role=freelancer">
                  Join as a freelancer <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="bg-card text-foreground shadow-sm">
                <Link href="/talent">Browse talent community</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

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
  Star,
  UsersRound,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getDBAsync } from "@/lib/auth/session";
import { fromJsonArray } from "@/lib/db";

interface FreelancerRow {
  id: string;
  full_name: string;
  title: string | null;
  bio: string | null;
  hourly_rate: number | null;
  skills: string | null;
  avatar_url: string | null;
}

async function getAllFreelancers() {
  try {
    const d1 = await getDBAsync();
    if (!d1) return [];
    
    const { results } = await d1
      .prepare(`
        SELECT id, full_name, title, bio, hourly_rate, skills, avatar_url
        FROM profiles
        WHERE role = 'freelancer'
        ORDER BY updated_at DESC
        LIMIT 12
      `)
      .all<FreelancerRow>();
    
    return results ?? [];
  } catch (error) {
    console.error("Failed to fetch freelancers:", error);
    return [];
  }
}

const categories = [
  {
    title: "Design & Creative",
    description:
      "Logo, branding, UI/UX, motion, illustration—unlock a roster of proven visual experts.",
    icon: LayoutGrid,
    skills: ["Figma", "Adobe Suite", "Branding"],
  },
  {
    title: "Development & Tech",
    description:
      "React, Next.js, PHP, mobile apps—find devs who ship production-ready code, fast.",
    icon: Compass,
    skills: ["React", "Node.js", "Python"],
  },
  {
    title: "Marketing & Growth",
    description:
      "SEO, paid ads, content strategy—scale your funnel with battle-tested marketers.",
    icon: Flame,
    skills: ["SEO", "Google Ads", "Content"],
  },
  {
    title: "Writing & Translation",
    description:
      "Copywriting, localisation, technical docs—craft any message in any language.",
    icon: Globe,
    skills: ["Copywriting", "Translation", "Editing"],
  },
  {
    title: "Admin & Support",
    description:
      "Virtual assistants, customer success, project coordination—keep operations humming.",
    icon: UsersRound,
    skills: ["Admin", "Support", "Coordination"],
  },
  {
    title: "Consulting & Strategy",
    description:
      "Business analysts, product advisors, coaches—get clarity from seasoned pros.",
    icon: Handshake,
    skills: ["Strategy", "Analysis", "Coaching"],
  },
];

const assurances = [
  {
    title: "Escrow-backed payments",
    description:
      "Funds stay protected until milestones are approved. Pay in BDT, USD, or your preferred currency.",
    icon: BadgeCheck,
  },
  {
    title: "Verified skill badges",
    description:
      "Freelancers earn trust marks through portfolio reviews, assessments, and client ratings.",
    icon: Sparkles,
  },
  {
    title: "Dispute resolution",
    description:
      "If things go sideways, our success team steps in to mediate and find fair outcomes.",
    icon: Handshake,
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

export default async function TalentPage() {
  const allFreelancers = await getAllFreelancers();
  
  // Get top 3 for spotlight
  const spotlightTalent = allFreelancers.slice(0, 3).map((f, i) => ({
    name: f.full_name,
    title: f.title ?? "Professional",
    rating: ["Top Rated Plus", "Rising Talent", "Expert-Vetted"][i % 3],
    skills: fromJsonArray(f.skills).slice(0, 4),
  }));
  
  const displaySpotlight = spotlightTalent.length > 0 ? spotlightTalent : [{
    name: "Join as Freelancer",
    title: "Be the first!",
    rating: "New",
    skills: ["Create your profile"],
  }];
  
  return (
    <div className="min-h-screen text-foreground">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-24 pt-16">
        <header className="grid gap-12 rounded-[32px] bg-white/90 p-10 shadow-[0_24px_64px_rgba(0,30,0,0.08)] md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-6">
            <Badge className="w-fit bg-accent/15 text-accent">Find Bangladeshi freelancers like you do on Upwork</Badge>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Discover elite independents ready for your next sprint.
            </h1>
            <p className="text-lg text-muted">
              Search curated profiles, invite Top Rated experts, and collaborate with confidence thanks to escrow protection,
              transparent reviews, and local success managers.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signup?role=freelancer">Create your freelancer profile</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="bg-card text-foreground shadow-sm">
                <Link href="/signup?role=employer">Post a job for free</Link>
              </Button>
            </div>
          </div>
          <Card className="space-y-5 border border-card-border bg-white/95 p-6 shadow-sm">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground" htmlFor="talent-search">
                Search for a skill or role
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/80" />
                <Input
                  id="talent-search"
                  placeholder="Try &quot;UI/UX designer&quot; or &quot;Full-stack developer&quot;"
                  className="h-12 rounded-2xl border-card-border bg-foreground/5 pl-10 text-sm text-foreground"
                  readOnly
                />
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted/80">Spotlight freelancers</p>
              <div className="space-y-4">
                {displaySpotlight.map((talent) => (
                  <div key={talent.name} className="rounded-2xl border border-card-border bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{talent.name}</p>
                        <p className="text-xs text-muted/80">{talent.title}</p>
                      </div>
                      <Badge className="bg-accent/10 text-accent">{talent.rating}</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {talent.skills.map((skill) => (
                        <span key={skill} className="rounded-full bg-foreground/5 px-3 py-1 text-xs text-muted">
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

        {/* All Available Freelancers Section */}
        <section className="space-y-10">
          <header className="space-y-4 text-center">
            <Badge className="mx-auto bg-accent/15 text-accent">
              <Star className="mr-1 h-3 w-3" /> Available Freelancers
            </Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">
              {allFreelancers.length > 0 
                ? `${allFreelancers.length} talented professionals ready to work`
                : "Be among the first freelancers"}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              Browse verified profiles, check skills and rates, and hire with confidence.
            </p>
          </header>
          
          {allFreelancers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allFreelancers.map((freelancer) => {
                const skills = fromJsonArray(freelancer.skills);
                const initials = freelancer.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);
                
                return (
                  <Card key={freelancer.id} className="flex flex-col gap-4 border border-card-border bg-white/95 p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      {freelancer.avatar_url ? (
                        <img 
                          src={freelancer.avatar_url} 
                          alt={freelancer.full_name}
                          className="h-14 w-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-lg font-semibold text-accent">
                          {initials}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{freelancer.full_name}</h3>
                        <p className="text-sm text-muted">{freelancer.title ?? "Freelancer"}</p>
                        {freelancer.hourly_rate && (
                          <p className="mt-1 text-sm font-medium text-accent">
                            ${freelancer.hourly_rate}/hr
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {freelancer.bio && (
                      <p className="line-clamp-2 text-sm text-muted">{freelancer.bio}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {skills.length > 4 && (
                        <Badge variant="muted" className="text-xs">+{skills.length - 4}</Badge>
                      )}
                    </div>
                    
                    <Button asChild variant="secondary" className="mt-auto">
                      <Link href="/signup?role=employer">View Profile</Link>
                    </Button>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-dashed p-12 text-center">
              <div className="mx-auto max-w-md space-y-4">
                <UsersRound className="mx-auto h-12 w-12 text-muted" />
                <h3 className="text-xl font-semibold">No freelancers yet</h3>
                <p className="text-muted">
                  Be among the first to create a profile and get discovered by employers!
                </p>
                <Button asChild size="lg">
                  <Link href="/signup?role=freelancer">Create Your Profile</Link>
                </Button>
              </div>
            </Card>
          )}
        </section>

        <section className="space-y-10">
          <header className="space-y-4 text-center">
            <Badge className="mx-auto bg-accent/15 text-accent">Top categories</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Start with battle-tested experts</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              Explore high-performing categories crafted to reflect Upwork&apos;s marketplace, with a focus on Bangladeshi excellence.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.title} className="h-full space-y-3 border border-card-border bg-white/90 p-6 shadow-sm">
                <category.icon className="h-8 w-8 text-accent" />
                <h3 className="text-lg font-semibold">{category.title}</h3>
                <p className="text-sm text-muted">{category.description}</p>
                <Button asChild variant="link" className="h-auto px-0 text-accent">
                  <Link href="/signup?role=employer">View available talent</Link>
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-10 rounded-[32px] bg-white/90 p-10 shadow-[0_20px_48px_rgba(0,30,0,0.06)] md:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <Badge className="bg-accent/15 text-accent">Why teams hire here</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Enterprise-grade confidence, freelancer-first experience</h2>
            <p className="text-lg text-muted">
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
                  <p className="text-sm text-muted">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-10">
          <header className="space-y-4 text-center">
            <Badge className="mx-auto bg-accent/15 text-accent">Work your way</Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Designed to help freelancers shine</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              From polished profiles to milestone tracking, we provide everything you need to deliver confidently and grow sustainably.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {milestones.map((milestone) => (
              <Card key={milestone.title} className="h-full space-y-3 border border-card-border bg-white/90 p-6 shadow-sm">
                <milestone.icon className="h-8 w-8 text-accent" />
                <h3 className="text-lg font-semibold">{milestone.title}</h3>
                <p className="text-sm text-muted">{milestone.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-transparent bg-gradient-to-r from-[#dff4df] via-[#b9ebc0] to-[#f0fff0] p-10 text-center shadow-[0_20px_48px_rgba(0,30,0,0.06)]">
          <div className="mx-auto max-w-3xl space-y-4">
            <h2 className="text-3xl font-semibold md:text-4xl">Build your dream roster today</h2>
            <p className="text-lg text-muted">
              Browse the very best of Bangladesh, invite the perfect fit, and start collaborating under the safety of escrow-backed contracts.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/signup?role=employer">Find freelancers</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="bg-card text-foreground shadow-sm">
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

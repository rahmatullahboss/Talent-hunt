import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  Globe2,
  Lightbulb,
  LineChart,
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

const categories = [
  {
    title: "Development & IT",
    description: "Full-stack, mobile, QA, data science",
    icon: Sparkles,
  },
  {
    title: "Design & Creative",
    description: "Product, brand, illustration, motion",
    icon: Lightbulb,
  },
  {
    title: "Sales & Marketing",
    description: "Growth, automation, paid media",
    icon: LineChart,
  },
  {
    title: "Writing & Translation",
    description: "Copy, scripts, localization, research",
    icon: MessageCircle,
  },
  {
    title: "Admin & Support",
    description: "Virtual assistants, finance, HR",
    icon: UsersRound,
  },
  {
    title: "Product & Project",
    description: "Product ops, PMs, scrum masters",
    icon: Briefcase,
  },
];

const assurances = [
  {
    title: "Pay once you hire",
    description: "Review proposals, meet talent, and only release funds after a contract begins.",
    icon: ShieldCheck,
  },
  {
    title: "Work confidently",
    description: "Milestones, timesheets, and dispute support keep every project transparent.",
    icon: BadgeCheck,
  },
  {
    title: "Scale globally",
    description: "Tap into verified Bangladeshi experts who collaborate across time zones.",
    icon: Globe2,
  },
];

const testimonials = [
  {
    quote:
      "We built an entire product squad in Dhaka through TalentHunt and released our new app twice as fast.",
    name: "Anika Rahman",
    role: "Head of Product, Chaldal",
  },
  {
    quote:
      "Every milestone feels effortless. Payment protection and local expertise make remote projects simple.",
    name: "Farhan Chowdhury",
    role: "Operations Lead, Daraz",
  },
  {
    quote:
      "I love how curated the briefs are. Clients arrive prepared, and expectations stay clear from day one.",
    name: "Jubayer Hasan",
    role: "Freelance Motion Designer",
  },
];

const trustedBy = ["Pathao", "ShopUp", "bKash", "iFarmer", "Shikho", "TallyKhata"];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f2f7f2] text-foreground">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-24 pt-12">
        <section
          id="marketplace"
          className="grid gap-12 rounded-[32px] bg-white p-10 shadow-[0_20px_60px_rgba(0,30,0,0.08)] lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="space-y-8">
            <Badge className="w-fit bg-[#dff4df] text-accent">A trusted Bangladeshi marketplace</Badge>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[#001e00] md:text-6xl">
              Connecting clients in need to freelancers who deliver.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-[#4d6553] md:text-xl">
              TalentHunt is your Upwork-inspired home for finding verified professionals across development, design, marketing,
              and more. Post a job, browse curated profiles, and launch projects with confidence.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signup?role=employer">
                  Post a job for free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="secondary" asChild size="lg">
                <Link href="/signup?role=freelancer">Find work</Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-[#4d6553]">
              <span className="font-semibold text-[#001e00]">Trusted by teams at</span>
              {trustedBy.map((brand) => (
                <span key={brand} className="rounded-full bg-[#e7f5e7] px-4 py-2 text-xs font-medium text-[#1f3a2a]">
                  {brand}
                </span>
              ))}
            </div>
          </div>
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-[#ecf8ec] via-white to-[#dff4df] p-8 shadow-none">
            <div className="absolute -right-32 -top-20 h-64 w-64 rounded-full bg-[#e7f7e7] blur-3xl" aria-hidden />
            <div className="relative space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-[0_30px_60px_rgba(0,30,0,0.08)]">
                <div className="flex items-center justify-between text-xs font-medium text-[#4d6553]">
                  <span className="inline-flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-accent" /> Mobile app redesign
                  </span>
                  <span className="rounded-full bg-[#e7f5e7] px-3 py-1 text-accent">৳ 75,000</span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-[#4d6553]">
                  <p>UI/UX · Motion · Design system</p>
                  <div className="flex items-center gap-2 text-xs text-[#1f3a2a]">
                    <Star className="h-4 w-4 fill-accent text-accent" /> 4.9 (128 reviews)
                  </div>
                </div>
              </div>
              <div className="ml-auto w-9/12 rounded-3xl bg-white p-6 shadow-[0_20px_40px_rgba(0,30,0,0.06)]">
                <p className="text-sm font-medium text-[#001e00]">&ldquo;Delivered ahead of schedule with an exceptional prototype.&rdquo;</p>
                <p className="mt-4 text-xs text-[#4d6553]">— Ahsan Karim, SaaS Founder</p>
              </div>
              <div className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-[0_12px_24px_rgba(0,30,0,0.05)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e7f5e7] text-sm font-semibold text-accent">
                  ZH
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#001e00]">Zara Haque</p>
                  <p className="text-xs text-[#4d6553]">Product Designer · Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="space-y-10">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold text-[#001e00]">Explore millions of pros</h2>
            <p className="max-w-2xl text-[#4d6553]">
              Browse the skills you need or invite our team to match you with curated experts ready to join your next project.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <Card
                key={category.title}
                className="flex flex-col gap-3 border-none bg-white p-6 shadow-[0_12px_24px_rgba(0,30,0,0.05)] transition hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(0,30,0,0.08)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e7f5e7] text-accent">
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#001e00]">{category.title}</h3>
                <p className="text-sm text-[#4d6553]">{category.description}</p>
                <Link href="/jobs" className="mt-auto inline-flex items-center text-sm font-semibold text-accent">
                  Browse talent <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        </section>

        <section id="enterprise" className="grid gap-12 rounded-[32px] bg-white p-10 shadow-[0_20px_60px_rgba(0,30,0,0.08)] lg:grid-cols-2">
          <div className="space-y-4">
            <Badge className="w-fit bg-[#dff4df] text-accent">Enterprise Suite</Badge>
            <h2 className="text-3xl font-semibold text-[#001e00]">
              Build your dream team with hands-on support from our success managers.
            </h2>
            <p className="text-[#4d6553]">
              From milestone planning to onboarding, our curated workflows help product leaders, startups, and agencies deliver
              reliably.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-[#1f3a2a]">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e7f5e7] px-4 py-2">
                <CheckCircle2 className="h-4 w-4 text-accent" /> Dedicated hiring partner
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e7f5e7] px-4 py-2">
                <Building2 className="h-4 w-4 text-accent" /> Compliance-ready contracts
              </span>
            </div>
            <Button variant="secondary" asChild>
              <Link href="/onboarding">Talk to sales</Link>
            </Button>
          </div>
          <div className="space-y-6">
            <Card className="border-none bg-[#f5fbf5] p-6 shadow-none">
              <h3 className="text-lg font-semibold text-[#001e00]">Curated project pods</h3>
              <p className="mt-2 text-sm text-[#4d6553]">
                Launch quickly with pre-vetted engineers, designers, and strategists who have shipped together before.
              </p>
            </Card>
            <Card className="border-none bg-[#f5fbf5] p-6 shadow-none">
              <h3 className="text-lg font-semibold text-[#001e00]">Insights & reporting</h3>
              <p className="mt-2 text-sm text-[#4d6553]">
                Keep stakeholders aligned with dashboards covering budget, delivery, and satisfaction metrics.
              </p>
            </Card>
            <Card className="border-none bg-[#f5fbf5] p-6 shadow-none">
              <h3 className="text-lg font-semibold text-[#001e00]">Localized onboarding</h3>
              <p className="mt-2 text-sm text-[#4d6553]">
                Ensure every freelancer is set up for success with streamlined compliance and fast payouts.
              </p>
            </Card>
          </div>
        </section>

        <section id="solutions" className="space-y-12">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold text-[#001e00]">Clients only pay after hiring</h2>
            <p className="max-w-3xl text-[#4d6553]">
              Work confidently with escrow-style protection, verified profiles, and milestone-based payments that mirror the
              Upwork experience tailored for Bangladesh.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {assurances.map((assurance) => (
              <Card key={assurance.title} className="flex flex-col gap-3 border-none bg-white p-6 shadow-[0_16px_32px_rgba(0,30,0,0.06)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e7f5e7] text-accent">
                  <assurance.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#001e00]">{assurance.title}</h3>
                <p className="text-sm text-[#4d6553]">{assurance.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold text-[#001e00]">Real results from clients</h2>
            <p className="max-w-3xl text-[#4d6553]">
              Teams across Dhaka, Chattogram, and beyond rely on TalentHunt to co-create products, campaigns, and operations that
              move their business forward.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="flex h-full flex-col justify-between border-none bg-white p-6 shadow-[0_16px_40px_rgba(0,30,0,0.06)]">
                <p className="text-sm leading-relaxed text-[#001e00]">“{testimonial.quote}”</p>
                <div className="mt-6 space-y-1 text-sm">
                  <p className="font-semibold text-[#001e00]">{testimonial.name}</p>
                  <p className="text-[#4d6553]">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[#14a800] via-[#108a00] to-[#0f7a00] p-12 text-white">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">Find your next hire for a short task or long-term growth.</h2>
              <p className="max-w-xl text-white/80">
                Join thousands of Bangladeshi teams creating world-class products with local experts.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button variant="secondary" asChild size="lg" className="bg-white text-accent hover:bg-[#f0fff0]">
                <Link href="/signup?role=employer">Start hiring</Link>
              </Button>
              <Button variant="ghost" asChild size="lg" className="border border-white bg-transparent text-white hover:bg-white/10">
                <Link href="/signup?role=freelancer">Join as talent</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

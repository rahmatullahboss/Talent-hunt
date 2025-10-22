import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const categories = [
  "Development & IT",
  "Design & Creative",
  "Sales & Marketing",
  "Writing & Translation",
  "Admin & Customer Support",
  "Finance & Accounting",
  "HR & Training",
  "Legal",
];

const assurances = [
  {
    title: "Proof of quality",
    description: "Check any pro’s work samples, client reviews, and identity verification.",
    icon: BadgeCheck,
  },
  {
    title: "No cost until you hire",
    description: "Interview potential fits for your job, negotiate rates, and only pay for work you approve.",
    icon: CheckCircle2,
  },
  {
    title: "Safe and secure",
    description: "Focus on your work knowing we help protect your data and privacy. We’re here with 24/7 support if you need it.",
    icon: ShieldCheck,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-col gap-24 px-6 pb-24 pt-12">
        <section className="grid gap-12 py-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold tracking-tight md:text-6xl">How work should work</h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Forget the old rules. You can have the best people. Right now. Right here.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signup">Get started</Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span className="font-semibold">Popular:</span>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Website Design</Badge>
                <Badge variant="secondary">WordPress</Badge>
                <Badge variant="secondary">Logo Design</Badge>
                <Badge variant="secondary">Video Editing</Badge>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            {/* <Image
              src="/hero-image.webp"
              alt="A person working on a laptop"
              width={500}
              height={500}
              className="rounded-lg"
            /> */}
          </div>
        </section>

        <section className="space-y-10 py-12">
          <div className="space-y-3 text-center">
            <h2 className="text-4xl font-bold">Browse talent by category</h2>
            <p className="text-muted-foreground">Looking for work? <Link href="/jobs" className="text-accent underline">Browse jobs</Link></p>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {categories.map((category) => (
              <Card key={category} className="cursor-pointer p-6 text-center transition hover:bg-muted/20">
                <h3 className="font-semibold">{category}</h3>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-12 rounded-lg bg-accent/5 p-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Up your work game, it’s easy</h2>
            <ul className="space-y-4 text-lg">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                <span><span className="font-semibold">No cost to join.</span> Register and browse professionals, free of charge.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                <span><span className="font-semibold">Post a job and hire top talent.</span> Finding talent doesn’t have to be a chore. Post a job or we can search for you!</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                <span><span className="font-semibold">Work with the best—without breaking the bank.</span> Upwork makes it affordable to up your work and take advantage of low transaction rates.</span>
              </li>
            </ul>
            <div className="flex gap-4 pt-4">
              <Button asChild>
                <Link href="/signup">Sign up for free</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="#">Learn how to hire</Link>
              </Button>
            </div>
          </div>
          <div className="hidden items-center justify-center lg:flex">
            {/* <Image
              src="/work-game.webp"
              alt="A person smiling"
              width={500}
              height={500}
              className="h-auto w-full max-w-md rounded-lg"
            /> */}
          </div>
        </section>

        <section className="space-y-12 py-24">
          <div className="space-y-3 text-center">
            <h2 className="text-4xl font-bold">Why businesses turn to Upwork</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {assurances.map((assurance) => (
              <Card key={assurance.title} className="flex flex-col gap-3 p-6">
                <div className="text-accent">
                  <assurance.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">{assurance.title}</h3>
                <p className="text-muted-foreground">{assurance.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-lg bg-foreground p-12 text-background">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">Find talent your way</h2>
              <p className="max-w-xl text-muted">
                Work with the largest network of independent professionals and get things done—from quick turnarounds to big transformations.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button variant="secondary" asChild size="lg">
                <Link href="/signup">Post a job and hire a pro</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

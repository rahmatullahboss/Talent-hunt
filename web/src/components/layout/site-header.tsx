"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/freelancers", label: "Find Freelancers" },
  { href: "/jobs", label: "Find Work" },
  { href: "/#solutions", label: "Why TalentHunt" },
  { href: "/#enterprise", label: "Enterprise" },
  { href: "/#catalog", label: "Project Catalog" },
];

export function SiteHeader() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href.startsWith("/#")) {
      return pathname === "/";
    }

    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 shadow-sm backdrop-blur">
      <div className="hidden border-b border-card-border/70 bg-[#f5fbf6] px-6 py-2 text-xs font-medium text-muted md:block">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <p>Hire Bangladesh&apos;s best freelancers with dedicated onboarding and payment protection.</p>
          <Link href="/contact" className="inline-flex items-center gap-1 text-accent">
            Talk to our team →
          </Link>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-lg font-semibold text-white shadow-sm">
            TH
          </span>
          <div className="flex flex-col">
            <span className="text-xl font-semibold tracking-tight text-foreground">TalentHunt</span>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Bangladesh</span>
          </div>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-muted md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 transition hover:bg-[#e5f7e9] hover:text-foreground",
                isActive(item.href) ? "bg-[#e5f7e9] text-foreground" : undefined,
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild className="text-muted hover:text-foreground">
            <Link href="/signin">Log in</Link>
          </Button>
          <Button asChild size="md" className="shadow-[0_10px_20px_rgba(20,168,0,0.2)]">
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
        <Button variant="secondary" size="icon" className="rounded-full border border-card-border bg-white text-foreground md:hidden">
          <span className="sr-only">Open menu</span>
          ≡
        </Button>
      </div>
    </header>
  );
}

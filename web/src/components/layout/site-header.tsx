"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/#marketplace", label: "Talent Marketplace" },
  { href: "/#enterprise", label: "Enterprise" },
  { href: "/#solutions", label: "Why TalentHunt" },
  { href: "/jobs", label: "Find Work" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-card-border/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-base font-semibold text-white">
            TH
          </span>
          <span className="text-xl">TalentHunt</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition hover:text-foreground",
                pathname === item.href ? "text-foreground" : undefined,
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/signin">Log in</Link>
          </Button>
          <Button asChild size="md">
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
        <Button variant="secondary" size="icon" className="md:hidden">
          <span className="sr-only">Open menu</span>
          ≡
        </Button>
      </div>
    </header>
  );
}

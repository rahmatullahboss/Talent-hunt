"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#workflow", label: "How it works" },
  { href: "/jobs", label: "Browse Jobs" },
  { href: "/talent", label: "Find Talent" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-card-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
          TalentHunt <span className="font-light text-accent">BD</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("transition hover:text-foreground", pathname === item.href ? "text-foreground" : undefined)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/auth/signin">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signup">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

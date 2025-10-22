"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/talent", label: "Find Freelancers" },
  { href: "/jobs", label: "Find Work" },
  { href: "/#why-talenthunt", label: "Why TalentHunt" },
  { href: "/#enterprise", label: "Enterprise" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-card-border/80 bg-white/90 backdrop-blur">
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
        <Button
          variant="secondary"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className="sr-only">Toggle menu</span>
          <svg
            aria-hidden="true"
            className={cn("h-5 w-5 transition", isMenuOpen ? "rotate-90" : undefined)}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isMenuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </Button>
      </div>
      <div
        id="mobile-menu"
        className={cn(
          "md:hidden",
          "fixed inset-x-0 top-16 z-30 mx-auto w-full max-w-6xl rounded-b-2xl border border-card-border/80 bg-white px-6 py-6 shadow-lg transition-all",
          isMenuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <nav className="flex flex-col gap-4 text-base font-medium text-foreground/80">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={cn(
                "rounded-md px-2 py-1.5 transition hover:bg-muted/70 hover:text-foreground",
                pathname === item.href ? "text-foreground" : undefined,
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 flex flex-col gap-3">
          <Button variant="ghost" className="justify-start" asChild onClick={closeMenu}>
            <Link href="/signin">Log in</Link>
          </Button>
          <Button size="md" asChild onClick={closeMenu}>
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-card-border/80 bg-white/95 backdrop-blur">
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
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
            <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
              Log in
            </Link>
          </Button>
          <Button asChild size="md">
            <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
              Sign up
            </Link>
          </Button>
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle menu</span>
          {isMenuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </Button>
        {isMenuOpen ? (
          <div
            id="mobile-menu"
            className="absolute inset-x-0 top-full z-50 flex flex-col gap-4 border-b border-card-border/80 bg-white px-6 py-4 text-sm font-medium text-muted shadow-lg md:hidden"
          >
            <nav className="flex flex-col gap-3">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "transition hover:text-foreground",
                    pathname === item.href ? "text-foreground" : undefined,
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <Button variant="ghost" asChild className="justify-start">
                <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
                  Log in
                </Link>
              </Button>
              <Button asChild size="md">
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                  Sign up
                </Link>
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

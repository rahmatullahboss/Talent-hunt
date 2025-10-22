"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.removeProperty("overflow");
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
          onClick={() => setIsMobileMenuOpen(true)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className="sr-only">Open menu</span>
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm md:hidden">
          <div className="flex items-center justify-between border-b border-card-border/80 px-6 py-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground"
              onClick={closeMobileMenu}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-base font-semibold text-white">
                TH
              </span>
              <span className="text-xl">TalentHunt</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={closeMobileMenu} aria-label="Close menu">
              <X className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
          <nav id="mobile-menu" className="flex flex-col gap-4 px-6 py-6 text-base font-medium text-foreground">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition", 
                  pathname === item.href ? "text-foreground" : "text-muted hover:text-foreground",
                )}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3 border-t border-card-border/80 px-6 py-6">
            <Button variant="ghost" asChild onClick={closeMobileMenu}>
              <Link href="/signin">Log in</Link>
            </Button>
            <Button asChild size="md" onClick={closeMobileMenu}>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

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
    <header className="border-b border-card-border bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-10">
          <Link href="/" className="text-2xl font-bold text-accent">
            TalentHunt
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-foreground md:flex">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition hover:text-accent",
                  pathname === item.href ? "text-accent" : undefined,
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/signin">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
        <Button variant="secondary" size="icon" className="md:hidden">
          <span className="sr-only">Open menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </div>
    </header>
  );
}

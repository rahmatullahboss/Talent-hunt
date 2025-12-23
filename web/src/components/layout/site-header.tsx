"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const publicLinks = [
  { href: "/marketplace", label: "Talent Marketplace" },
  { href: "/hire", label: "How to Hire" },
  { href: "/jobs", label: "Find Work" },
  { href: "/talent", label: "Find Freelancers" },
  { href: "/#why-talenthunt", label: "Why TalentHunt" },
];

// Freelancer dropdown menus
const freelancerMenus = {
  findWork: {
    label: "Find Work",
    items: [
      { href: "/freelancer/jobs", label: "Find Work" },
      { href: "/freelancer/proposals", label: "My Proposals" },
    ],
  },
  deliverWork: {
    label: "Deliver Work",
    items: [
      { href: "/freelancer/contracts", label: "Active Contracts" },
      { href: "/freelancer/portfolio", label: "Portfolio" },
    ],
  },
  finances: {
    label: "Finances",
    items: [
      { href: "/freelancer/wallet", label: "Wallet & Earnings" },
    ],
  },
};

type ProfileSummary = {
  role: "freelancer" | "employer" | "admin";
  onboarding_complete: number;
  full_name: string;
};

function DropdownMenu({ 
  label, 
  items, 
  isOpen, 
  onToggle 
}: { 
  label: string; 
  items: { href: string; label: string }[]; 
  isOpen: boolean; 
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 text-sm font-medium text-black transition hover:text-black/70"
      >
        {label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 min-w-[200px] rounded-xl border border-card-border bg-white p-2 shadow-lg">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
              onClick={onToggle}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [hasSession, setHasSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          if (data.user && data.profile) {
            setHasSession(true);
            setProfile(data.profile);
          } else {
            setHasSession(false);
            setProfile(null);
          }
        } else {
          setHasSession(false);
          setProfile(null);
        }
      } catch {
        setHasSession(false);
        setProfile(null);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    if (openDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openDropdown]);

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signout", { method: "POST" });
      if (response.ok) {
        toast.success("Signed out successfully.");
        closeMenu();
        router.push("/signin");
        router.refresh();
      } else {
        toast.error("Failed to sign out.");
      }
    } catch {
      toast.error("Failed to sign out.");
    }
  };

  const dashboardHref = useMemo(() => {
    if (!profile) return "/onboarding";
    if (profile.onboarding_complete === 0) return "/onboarding";

    switch (profile.role) {
      case "freelancer":
        return "/freelancer/dashboard";
      case "employer":
        return "/employer/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/onboarding";
    }
  }, [profile]);

  const isAuthenticated = hasSession;
  const isFreelancer = profile?.role === "freelancer";

  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-card-border/80 bg-white shadow-sm md:bg-white/90 md:shadow-none md:backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 text-black sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="TalentHunt BD" className="h-12" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-black md:flex">
          {isAuthenticated && isFreelancer ? (
            <>
              {/* Freelancer Dropdown Menus */}
              <DropdownMenu
                label={freelancerMenus.findWork.label}
                items={freelancerMenus.findWork.items}
                isOpen={openDropdown === "findWork"}
                onToggle={(e?: React.MouseEvent) => {
                  e?.stopPropagation?.();
                  setOpenDropdown(openDropdown === "findWork" ? null : "findWork");
                }}
              />
              <DropdownMenu
                label={freelancerMenus.deliverWork.label}
                items={freelancerMenus.deliverWork.items}
                isOpen={openDropdown === "deliverWork"}
                onToggle={(e?: React.MouseEvent) => {
                  e?.stopPropagation?.();
                  setOpenDropdown(openDropdown === "deliverWork" ? null : "deliverWork");
                }}
              />
              <DropdownMenu
                label={freelancerMenus.finances.label}
                items={freelancerMenus.finances.items}
                isOpen={openDropdown === "finances"}
                onToggle={(e?: React.MouseEvent) => {
                  e?.stopPropagation?.();
                  setOpenDropdown(openDropdown === "finances" ? null : "finances");
                }}
              />
              <Link
                href="/freelancer/messages"
                className="flex items-center gap-1 transition hover:text-black/70"
              >
                <MessageSquare className="h-4 w-4" />
                Messages
              </Link>
            </>
          ) : (
            // Public Navigation
            publicLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn("transition hover:text-black/80", pathname === item.href ? "text-black" : undefined)}
              >
                {item.label}
              </Link>
            ))
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" asChild>
                <Link href={dashboardHref}>Dashboard</Link>
              </Button>
              <Button variant="secondary" onClick={handleSignOut}>
                Log out
              </Button>
            </>
          ) : isCheckingSession ? null : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/signin">Log in</Link>
              </Button>
              <Button asChild size="md">
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="secondary"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-x-0 bottom-0 top-[4.5rem] z-30 bg-black/10 backdrop-blur-sm"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div
            id="mobile-menu"
            className={cn(
              "fixed inset-x-0 top-[4.5rem] bottom-0 z-40 mx-auto w-full max-w-6xl",
              "rounded-b-2xl border border-card-border/80 bg-white px-6 pb-8 pt-6 shadow-lg",
              "overflow-y-auto"
            )}
          >
            <nav className="flex flex-col gap-4 text-base font-medium text-black/80">
              {isAuthenticated && isFreelancer ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Find Work</p>
                  {freelancerMenus.findWork.items.map((item) => (
                    <Link key={item.href} href={item.href} onClick={closeMenu} className="rounded-md px-2 py-1.5 hover:bg-gray-100">
                      {item.label}
                    </Link>
                  ))}
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Deliver Work</p>
                  {freelancerMenus.deliverWork.items.map((item) => (
                    <Link key={item.href} href={item.href} onClick={closeMenu} className="rounded-md px-2 py-1.5 hover:bg-gray-100">
                      {item.label}
                    </Link>
                  ))}
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Finances</p>
                  {freelancerMenus.finances.items.map((item) => (
                    <Link key={item.href} href={item.href} onClick={closeMenu} className="rounded-md px-2 py-1.5 hover:bg-gray-100">
                      {item.label}
                    </Link>
                  ))}
                  <Link href="/freelancer/messages" onClick={closeMenu} className="mt-4 rounded-md px-2 py-1.5 hover:bg-gray-100">
                    Messages
                  </Link>
                </>
              ) : (
                publicLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={cn("rounded-md px-2 py-1.5 hover:bg-gray-100", pathname === item.href ? "text-black" : undefined)}
                  >
                    {item.label}
                  </Link>
                ))
              )}
            </nav>
            <div className="mt-6 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Button variant="outline" className="justify-start" onClick={() => { closeMenu(); router.push(dashboardHref); }}>
                    Dashboard
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={handleSignOut}>
                    Log out
                  </Button>
                </>
              ) : isCheckingSession ? null : (
                <>
                  <Button variant="ghost" className="justify-start" asChild onClick={closeMenu}>
                    <Link href="/signin">Log in</Link>
                  </Button>
                  <Button size="md" asChild onClick={closeMenu}>
                    <Link href="/signup">Sign up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

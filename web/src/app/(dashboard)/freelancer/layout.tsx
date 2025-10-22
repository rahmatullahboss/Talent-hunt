import { redirect } from "next/navigation";
import { Briefcase, FileText, LayoutDashboard, Palette, UserRound, Wallet } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { SidebarLink } from "@/components/dashboard/sidebar";
import { getCurrentUser } from "@/lib/auth/session";

const links: SidebarLink[] = [
  { href: "/freelancer/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/freelancer/jobs", label: "Find Jobs", icon: Briefcase },
  { href: "/freelancer/proposals", label: "Proposals", icon: FileText },
  { href: "/freelancer/portfolio", label: "Portfolio", icon: Palette },
  { href: "/freelancer/profile", label: "Profile settings", icon: UserRound },
  { href: "/freelancer/wallet", label: "Wallet", icon: Wallet },
];

export default async function FreelancerLayout({ children }: { children: React.ReactNode }) {
  const auth = await getCurrentUser();

  if (!auth?.user) {
    redirect("/signin");
  }

  if (auth.profile?.role !== "freelancer") {
    switch (auth.profile?.role) {
      case "employer":
        redirect("/employer/dashboard");
        break;
      case "admin":
        redirect("/admin/dashboard");
        break;
      default:
        redirect("/onboarding");
    }
  }

  if (!auth.profile?.onboarding_complete) {
    redirect("/onboarding");
  }

  return <DashboardShell profile={auth.profile!} links={links}>{children}</DashboardShell>;
}

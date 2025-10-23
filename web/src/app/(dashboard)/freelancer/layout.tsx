import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { SidebarLink } from "@/components/dashboard/sidebar";
import { getCurrentUser } from "@/lib/auth/session";

const links: SidebarLink[] = [
  { href: "/freelancer/dashboard", label: "Overview", icon: "layoutDashboard" },
  { href: "/freelancer/jobs", label: "Find Jobs", icon: "briefcase" },
  { href: "/freelancer/proposals", label: "Proposals", icon: "fileText" },
  { href: "/freelancer/messages", label: "Messages", icon: "messageSquare" },
  { href: "/freelancer/portfolio", label: "Portfolio", icon: "palette" },
  { href: "/freelancer/profile", label: "Profile settings", icon: "userRound" },
  { href: "/freelancer/wallet", label: "Wallet", icon: "wallet" },
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

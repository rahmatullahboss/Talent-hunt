import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { SidebarLink } from "@/components/dashboard/sidebar";
import { getCurrentUser } from "@/lib/auth/session";

const links: SidebarLink[] = [
  { href: "/employer/dashboard", label: "Overview", icon: "layoutDashboard" },
  { href: "/employer/jobs/new", label: "Post a job", icon: "clipboardList" },
  { href: "/employer/jobs", label: "Manage jobs", icon: "clipboardCheck" },
  { href: "/employer/freelancers", label: "Find talent", icon: "search" },
  { href: "/employer/contracts", label: "Contracts", icon: "users" },
  { href: "/employer/messages", label: "Messages", icon: "messageSquare" },
  { href: "/employer/payments", label: "Payments", icon: "wallet" },
];

export default async function EmployerLayout({ children }: { children: React.ReactNode }) {
  const auth = await getCurrentUser();

  if (!auth?.user) {
    redirect("/signin");
  }

  if (auth.profile?.role === "freelancer") {
    redirect("/freelancer/dashboard");
  }

  if (auth.profile?.role === "admin") {
    redirect("/admin/dashboard");
  }

  if (!auth.profile?.onboarding_complete) {
    redirect("/onboarding");
  }

  return <DashboardShell profile={auth.profile!} links={links}>{children}</DashboardShell>;
}

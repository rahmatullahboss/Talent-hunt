import { redirect } from "next/navigation";
import { Shield, Settings, Users, FileWarning, LayoutDashboard } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { SidebarLink } from "@/components/dashboard/sidebar";
import { getCurrentUser } from "@/lib/auth/session";

const links: SidebarLink[] = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/jobs", label: "Jobs", icon: Shield },
  { href: "/admin/disputes", label: "Disputes", icon: FileWarning },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await getCurrentUser();

  if (!auth?.user) {
    redirect("/auth/signin");
  }

  if (auth.profile?.role !== "admin") {
    if (auth.profile?.role === "freelancer") {
      redirect("/freelancer/dashboard");
    }
    if (auth.profile?.role === "employer") {
      redirect("/employer/dashboard");
    }
    redirect("/");
  }

  return <DashboardShell profile={auth.profile!} links={links}>{children}</DashboardShell>;
}

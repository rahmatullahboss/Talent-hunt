import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { SidebarLink } from "@/components/dashboard/sidebar";
import { getCurrentUser } from "@/lib/auth/session";

const links: SidebarLink[] = [
  { href: "/admin/dashboard", label: "Overview", icon: "layoutDashboard" },
  { href: "/admin/users", label: "Users", icon: "users" },
  { href: "/admin/jobs", label: "Jobs", icon: "shield" },
  { href: "/admin/disputes", label: "Disputes", icon: "fileWarning" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await getCurrentUser();

  if (!auth?.user) {
    redirect("/signin");
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

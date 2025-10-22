import type { ReactNode } from "react";
import type { Tables } from "@/types/database";
import { DashboardSidebar, type SidebarLink } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";

interface DashboardShellProps {
  profile: Tables<"profiles">;
  links: SidebarLink[];
  children: ReactNode;
  topbarActions?: ReactNode;
}

export function DashboardShell({ profile, links, children, topbarActions }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar profile={profile} links={links} />
      <div className="flex flex-1 flex-col">
        <DashboardTopbar profile={profile} actions={topbarActions} />
        <main className="flex-1 bg-gradient-to-b from-background via-background to-foreground/5 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}

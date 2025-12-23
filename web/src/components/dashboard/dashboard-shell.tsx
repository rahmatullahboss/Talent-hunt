import type { ReactNode } from "react";
import type { Profile } from "@/lib/auth/session";
import { DashboardSidebar, type SidebarLink } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

interface DashboardShellProps {
  profile: Profile;
  links: SidebarLink[];
  children: ReactNode;
  topbarActions?: ReactNode;
}

export function DashboardShell({ profile, links, children, topbarActions }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <div className="flex flex-1">
        <DashboardSidebar profile={profile} links={links} />
        <div className="flex flex-1 flex-col">
          <DashboardTopbar profile={profile} actions={topbarActions} />
          <main className="flex-1 px-6 py-8">
            <div className="mx-auto flex w-full max-w-6xl flex-col">{children}</div>
          </main>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

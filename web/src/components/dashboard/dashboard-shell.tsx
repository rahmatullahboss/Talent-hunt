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
    <div className="flex min-h-screen bg-gradient-to-br from-[#eefbf4] via-[#f6fdf8] to-white">
      <DashboardSidebar profile={profile} links={links} />
      <div className="flex flex-1 flex-col">
        <DashboardTopbar profile={profile} actions={topbarActions} />
        <main className="flex-1 px-6 py-8">
          {/* Keep dashboard content centred and consistent with the marketing pages. */}
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

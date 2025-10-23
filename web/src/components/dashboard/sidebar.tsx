"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  ClipboardCheck,
  ClipboardList,
  FileText,
  FileWarning,
  LayoutDashboard,
  MessageSquare,
  Palette,
  Search,
  Settings,
  Shield,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Tables } from "@/types/database";

const iconMap = {
  layoutDashboard: LayoutDashboard,
  clipboardList: ClipboardList,
  clipboardCheck: ClipboardCheck,
  search: Search,
  messageSquare: MessageSquare,
  wallet: Wallet,
  briefcase: Briefcase,
  fileText: FileText,
  palette: Palette,
  userRound: UserRound,
  shield: Shield,
  settings: Settings,
  users: Users,
  fileWarning: FileWarning,
} as const;

export type SidebarIcon = keyof typeof iconMap;

export type SidebarLink = {
  href: string;
  label: string;
  icon: SidebarIcon;
  badge?: string;
};

interface DashboardSidebarProps {
  profile: Tables<"profiles">;
  links: SidebarLink[];
  footer?: React.ReactNode;
}

export function DashboardSidebar({ profile, links, footer }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 flex-col border-r border-card-border/70 bg-white/80 px-4 py-6 shadow-[0_20px_60px_rgba(0,30,0,0.08)] backdrop-blur lg:flex">
      <Link href="/" className="mb-8 inline-flex items-center gap-2 text-lg font-semibold text-foreground">
        TalentHunt <span className="font-light text-accent">BD</span>
      </Link>

      <div className="mb-8 flex items-center gap-3 rounded-[var(--radius-md)] border border-card-border/70 bg-white/90 p-4">
        <Avatar src={profile.avatar_url} fallback={profile.full_name} />
        <div className="text-sm">
          <p className="font-semibold text-foreground">{profile.full_name}</p>
          <p className="text-muted/90">{profile.title ?? profile.role.toUpperCase()}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          const Icon = iconMap[link.icon] ?? LayoutDashboard;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex items-center justify-between rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-medium transition",
                isActive ? "bg-accent/10 text-accent" : "text-muted/90 hover:bg-accent/5 hover:text-foreground",
              )}
            >
              <span className="inline-flex items-center gap-3">
                <Icon className={cn("h-4 w-4", isActive ? "text-accent" : "text-muted/80 group-hover:text-foreground")} />
                {link.label}
              </span>
              {link.badge ? <Badge variant="muted">{link.badge}</Badge> : null}
            </Link>
          );
        })}
      </nav>

      {footer ? <div className="mt-8">{footer}</div> : null}
    </aside>
  );
}

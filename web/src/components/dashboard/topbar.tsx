"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

interface Profile {
  id: string;
  full_name: string;
  role: string;
  avatar_url: string | null;
}

interface DashboardTopbarProps {
  profile: Profile;
  actions?: React.ReactNode;
}

export function DashboardTopbar({ profile, actions }: DashboardTopbarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signout", { method: "POST" });
      if (response.ok) {
        toast.success("Signed out successfully");
        router.push("/signin");
        router.refresh();
      } else {
        toast.error("Failed to sign out");
      }
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <header className="flex items-center justify-between border-b border-card-border/70 bg-white/70 px-6 py-4 shadow-sm shadow-foreground/5 backdrop-blur">
      <div className="flex items-center gap-3">
        <Avatar src={profile.avatar_url} fallback={profile.full_name} size="sm" />
        <div className="text-sm">
          <p className="font-medium text-foreground">{profile.full_name}</p>
          <p className="text-muted/80 capitalize">{profile.role}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <Button variant="ghost" size="sm" onClick={handleSignOut} aria-label="Sign out">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

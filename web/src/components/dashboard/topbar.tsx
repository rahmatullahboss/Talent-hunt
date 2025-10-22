"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Tables } from "@/types/database";

interface DashboardTopbarProps {
  profile: Tables<"profiles">;
  actions?: React.ReactNode;
}

export function DashboardTopbar({ profile, actions }: DashboardTopbarProps) {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Signed out successfully");
    router.push("/signin");
    router.refresh();
  };

  return (
    <header className="flex items-center justify-between border-b border-card-border bg-card/70 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <Avatar src={profile.avatar_url} fallback={profile.full_name} size="sm" />
        <div className="text-sm">
          <p className="font-medium text-foreground">{profile.full_name}</p>
          <p className="text-muted capitalize">{profile.role}</p>
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

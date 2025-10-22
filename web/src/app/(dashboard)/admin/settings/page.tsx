import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { AdminSettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/signin");
  }

  const supabase = createSupabaseServerClient();
  const { data: settings } = await supabase.from("admin_settings").select("*").limit(1).maybeSingle();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Platform settings</h1>
        <p className="text-sm text-muted">Update payout instructions and commission policy visible to employers and freelancers.</p>
      </div>

      <Card className="border border-card-border/70 bg-card/80 p-6">
        <AdminSettingsForm settings={settings} />
      </Card>
    </div>
  );
}

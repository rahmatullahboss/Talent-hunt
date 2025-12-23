import { redirect } from "next/navigation";
import { getCurrentUser, getDBAsync } from "@/lib/auth/session";
import { Card } from "@/components/ui/card";
import { AdminSettingsForm } from "@/components/admin/settings-form";

interface AdminSettings {
  id?: string;
  commission_percentage: number;
  bank_account_name: string | null;
  bank_account_number: string | null;
  bank_name: string | null;
  mobile_wallet_provider: string | null;
  mobile_wallet_number: string | null;
}

export default async function AdminSettingsPage() {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/signin");
  }

  const d1 = await getDBAsync();
  let settings: AdminSettings | null = null;

  if (d1) {
    try {
      settings = await d1.prepare(`SELECT * FROM admin_settings LIMIT 1`).first<AdminSettings>();
    } catch (error) {
      console.error("Failed to fetch admin settings:", error);
    }
  }

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

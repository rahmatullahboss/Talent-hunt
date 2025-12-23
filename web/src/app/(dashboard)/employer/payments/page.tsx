import { redirect } from "next/navigation";
import { getCurrentUser, getDBAsync } from "@/lib/auth/session";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AdminSettings {
  bank_account_name: string | null;
  bank_account_number: string | null;
  bank_name: string | null;
  mobile_wallet_provider: string | null;
  mobile_wallet_number: string | null;
}

export default async function EmployerPaymentsPage() {
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
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Payments & escrow</h1>
        <p className="text-sm text-muted">Securely fund projects and release payouts when you&apos;re satisfied with the delivery.</p>
      </div>

      <Card className="space-y-4 border border-card-border/70 bg-card/80 p-6">
        <h2 className="text-xl font-semibold text-foreground">How payments work</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li>• Fund the agreed amount via bank transfer or mobile wallet to lock the project budget.</li>
          <li>• Funds remain in TalentHunt BD&apos;s escrow ledger until you release them after approval.</li>
          <li>• Request invoices or payment confirmations anytime from the admin dashboard.</li>
        </ul>
      </Card>

      <Card className="space-y-3 border border-card-border/70 bg-card/80 p-6">
        <h2 className="text-xl font-semibold text-foreground">Funding instructions</h2>
        {settings ? (
          <div className="space-y-2 text-sm text-muted">
            <p>
              <span className="font-semibold text-foreground">Account name:</span> {settings.bank_account_name ?? "Set via admin"}
            </p>
            <p>
              <span className="font-semibold text-foreground">Account number:</span> {settings.bank_account_number ?? "Set via admin"}
            </p>
            <p>
              <span className="font-semibold text-foreground">Bank:</span> {settings.bank_name ?? "Set via admin"}
            </p>
            <p>
              <span className="font-semibold text-foreground">Mobile wallet:</span> {settings.mobile_wallet_provider ?? "—"} {settings.mobile_wallet_number ?? ""}
            </p>
            <Badge variant="muted">Reference your contract ID when transferring funds.</Badge>
          </div>
        ) : (
          <p className="text-sm text-muted">Payout instructions are not configured yet. Contact the TalentHunt BD admin team.</p>
        )}
      </Card>
    </div>
  );
}

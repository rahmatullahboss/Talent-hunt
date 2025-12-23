import { redirect } from "next/navigation";
import { getCurrentUser, getDBAsync } from "@/lib/auth/session";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WithdrawalForm } from "@/components/freelancer/wallet/withdrawal-form";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  reference: string | null;
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  status: string;
  created_at: string;
}

interface AdminSettings {
  bank_account_name: string | null;
  bank_account_number: string | null;
  bank_name: string | null;
  mobile_wallet_provider: string | null;
  mobile_wallet_number: string | null;
}

export default async function WalletPage() {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/signin");
  }

  const d1 = await getDBAsync();
  let transactions: Transaction[] = [];
  let withdrawalRequests: WithdrawalRequest[] = [];
  let settings: AdminSettings | null = null;

  if (d1) {
    try {
      const [txnResult, withdrawalResult, settingsResult] = await Promise.all([
        d1.prepare(`
          SELECT id, type, amount, status, reference, created_at
          FROM wallet_transactions
          WHERE user_id = ?
          ORDER BY created_at DESC
        `).bind(auth.profile.id).all<Transaction>(),
        d1.prepare(`
          SELECT id, amount, status, created_at
          FROM withdrawal_requests
          WHERE freelancer_id = ?
          ORDER BY created_at DESC
        `).bind(auth.profile.id).all<WithdrawalRequest>(),
        d1.prepare(`SELECT * FROM admin_settings LIMIT 1`).first<AdminSettings>(),
      ]);

      transactions = txnResult.results ?? [];
      withdrawalRequests = withdrawalResult.results ?? [];
      settings = settingsResult;
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
    }
  }

  const earnings = transactions
    .filter((txn) => ["deposit", "release"].includes(txn.type) && txn.status !== "failed")
    .reduce((acc, txn) => acc + Number(txn.amount ?? 0), 0);
  const withdrawalsTotal = transactions
    .filter((txn) => txn.type === "withdrawal" && txn.status !== "failed")
    .reduce((acc, txn) => acc + Number(txn.amount ?? 0), 0);
  const balance = earnings - withdrawalsTotal;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Wallet & payouts</h1>
        <p className="text-sm text-muted">Track payments held in escrow, released earnings, and withdrawal requests.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Available balance" value={`৳${balance.toLocaleString()}`} />
        <StatCard label="Total earnings" value={`৳${earnings.toLocaleString()}`} />
        <StatCard label="Pending withdrawals" value={`৳${sumPending(withdrawalRequests)}`} />
        <StatCard label="Requests count" value={withdrawalRequests.length} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card className="space-y-5 border border-card-border/70 bg-card/80 p-6">
          <h2 className="text-xl font-semibold text-foreground">Request a withdrawal</h2>
          <p className="text-sm text-muted">Funds are processed manually within 2 business days after review. Ensure your bank details are accurate.</p>
          <WithdrawalForm />
        </Card>

        <Card className="space-y-4 border border-card-border/70 bg-card/80 p-6">
          <h2 className="text-xl font-semibold text-foreground">Payout instructions</h2>
          {settings ? (
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <span className="font-medium text-foreground">Account name:</span> {settings.bank_account_name ?? "Please set in admin settings"}
              </li>
              <li>
                <span className="font-medium text-foreground">Account number:</span> {settings.bank_account_number ?? "—"}
              </li>
              <li>
                <span className="font-medium text-foreground">Bank:</span> {settings.bank_name ?? "—"}
              </li>
              <li>
                <span className="font-medium text-foreground">Mobile wallet:</span> {settings.mobile_wallet_provider ?? "—"} {settings.mobile_wallet_number ?? ""}
              </li>
              <li className="text-xs text-muted">
                After submitting a withdrawal request, our finance team will confirm once funds are disbursed to your bank or mobile wallet.
              </li>
            </ul>
          ) : (
            <p className="text-sm text-muted">Admin has not configured payout details yet.</p>
          )}
        </Card>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Transaction history</h2>
        {transactions.length === 0 ? (
          <Card className="border-dashed p-6 text-sm text-muted">No transactions recorded yet.</Card>
        ) : (
          <div className="grid gap-3">
            {transactions.map((txn) => (
              <Card key={txn.id} className="flex flex-wrap items-center justify-between gap-3 border border-card-border/60 bg-card/80 p-4">
                <div>
                  <p className="text-sm font-semibold text-foreground capitalize">{txn.type.replace("_", " ")}</p>
                  <p className="text-xs text-muted">{new Date(txn.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={txn.status === "cleared" ? "success" : txn.status === "pending" ? "muted" : "danger"}>{txn.status}</Badge>
                  <p className="text-sm font-semibold text-foreground">৳{Number(txn.amount).toLocaleString()}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Withdrawal requests</h2>
        {withdrawalRequests.length > 0 ? (
          <div className="grid gap-3">
            {withdrawalRequests.map((request) => (
              <Card key={request.id} className="flex items-center justify-between border border-card-border/60 bg-card/80 p-4 text-sm">
                <div>
                  <p className="text-foreground font-semibold">৳{Number(request.amount).toLocaleString()}</p>
                  <p className="text-xs text-muted">{new Date(request.created_at).toLocaleString()}</p>
                </div>
                <Badge variant={request.status === "completed" ? "success" : request.status === "pending" ? "muted" : "outline"}>{request.status}</Badge>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed p-6 text-sm text-muted">No withdrawal requests yet.</Card>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="space-y-2 border border-card-border/70 bg-card/80 p-4">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
    </Card>
  );
}

function sumPending(requests: { amount: number; status: string }[]) {
  return requests.filter((request) => request.status === "pending" || request.status === "processing").reduce((acc, item) => acc + Number(item.amount ?? 0), 0);
}

import { redirect } from "next/navigation";
import { getCurrentUser, getDB } from "@/lib/auth/session";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WithdrawalRequest {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  freelancer_id: string;
  freelancer_name: string;
}

export default async function AdminDashboardPage() {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/signin");
  }

  const db = getDB();
  if (!db) {
    return <div>Database not available</div>;
  }

  const [profilesCount, suspendedCount, jobsCount, disputesCount, withdrawals] = await Promise.all([
    db.prepare("SELECT COUNT(*) as count FROM profiles").first<{ count: number }>(),
    db.prepare("SELECT COUNT(*) as count FROM profiles WHERE is_suspended = 1").first<{ count: number }>(),
    db.prepare("SELECT COUNT(*) as count FROM jobs WHERE status = 'open'").first<{ count: number }>(),
    db.prepare("SELECT COUNT(*) as count FROM disputes WHERE status IN ('open', 'under_review')").first<{ count: number }>(),
    db.prepare(`
      SELECT wr.id, wr.amount, wr.status, wr.created_at, wr.freelancer_id, p.full_name as freelancer_name
      FROM withdrawal_requests wr
      LEFT JOIN profiles p ON wr.freelancer_id = p.id
      WHERE wr.status IN ('pending', 'processing')
      ORDER BY wr.created_at DESC
      LIMIT 5
    `).all<WithdrawalRequest>(),
  ]);

  const totalUsers = profilesCount?.count ?? 0;
  const totalSuspended = suspendedCount?.count ?? 0;
  const openJobs = jobsCount?.count ?? 0;
  const openDisputes = disputesCount?.count ?? 0;
  const pendingWithdrawals = withdrawals.results ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Admin overview</h1>
        <p className="text-sm text-muted">Monitor platform health, payments, and disputes across TalentHunt BD.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={totalUsers} />
        <StatCard label="Suspended" value={totalSuspended} />
        <StatCard label="Open jobs" value={openJobs} />
        <StatCard label="Open disputes" value={openDisputes} />
      </section>

      <Card className="space-y-4 border border-card-border/70 bg-card/80 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Pending withdrawals</h2>
          <Badge variant="muted">{pendingWithdrawals.length}</Badge>
        </div>
        {pendingWithdrawals.length === 0 ? (
          <p className="text-sm text-muted">No payout requests are waiting for review.</p>
        ) : (
          <div className="grid gap-3">
            {pendingWithdrawals.map((request) => (
              <Card key={request.id} className="flex items-center justify-between border border-card-border/70 bg-card/80 p-4 text-sm">
                <div>
                  <p className="font-semibold text-foreground">৳{Number(request.amount).toLocaleString()}</p>
                  <p className="text-xs text-muted">{request.freelancer_name || "Freelancer"}</p>
                </div>
                <Badge variant="muted">{request.status}</Badge>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="space-y-2 border border-card-border/70 bg-card/80 p-4">
      <p className="text-xs uppercase text-muted">{label}</p>
      <p className="text-3xl font-semibold text-foreground">{value}</p>
    </Card>
  );
}

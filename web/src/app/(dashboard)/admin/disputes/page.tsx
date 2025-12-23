import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, getDB } from "@/lib/auth/session";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DisputeStatusForm } from "@/components/admin/dispute-status-form";

interface Dispute {
  id: string;
  status: string;
  reason: string;
  resolution: string | null;
  created_at: string;
  contract_id: string;
  opened_by_id: string;
  job_title: string | null;
  opened_by_name: string | null;
}

export default async function AdminDisputesPage() {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/signin");
  }

  const db = getDB();
  if (!db) {
    return <div>Database not available</div>;
  }

  const result = await db.prepare(`
    SELECT 
      d.id, d.status, d.reason, d.resolution, d.created_at, d.contract_id, d.opened_by_id,
      j.title as job_title,
      p.full_name as opened_by_name
    FROM disputes d
    LEFT JOIN contracts c ON d.contract_id = c.id
    LEFT JOIN jobs j ON c.job_id = j.id
    LEFT JOIN profiles p ON d.opened_by_id = p.id
    ORDER BY d.created_at DESC
  `).all<Dispute>();

  const disputes = result.results ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Disputes</h1>
        <p className="text-sm text-muted">Resolve conflicts and keep both parties informed with transparent notes.</p>
      </div>

      <div className="grid gap-4">
        {disputes.map((dispute) => (
          <Card key={dispute.id} className="space-y-3 border border-card-border/70 bg-card/80 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-foreground">{dispute.job_title ?? "Contract"}</p>
                <p className="text-xs text-muted">Opened by {dispute.opened_by_name ?? "User"}</p>
                <p className="text-xs text-muted">{new Date(dispute.created_at).toLocaleString()}</p>
              </div>
              <Badge variant="muted">{dispute.status}</Badge>
            </div>
            <p className="text-sm text-muted">Reason: {dispute.reason}</p>
            {dispute.resolution ? <p className="text-sm text-muted">Resolution: {dispute.resolution}</p> : null}
            <div className="flex items-center gap-3 text-sm">
              <Link href={`/contracts/${dispute.contract_id ?? ""}`} className="text-accent underline">
                Open workspace
              </Link>
            </div>
            <DisputeStatusForm disputeId={dispute.id} currentStatus={dispute.status} resolution={dispute.resolution} />
          </Card>
        ))}
      </div>
    </div>
  );
}

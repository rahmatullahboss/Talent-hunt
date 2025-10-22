import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DisputeStatusForm } from "@/components/admin/dispute-status-form";

export default async function AdminDisputesPage() {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/auth/signin");
  }

  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("disputes")
    .select(`
      id,
      status,
      reason,
      resolution,
      created_at,
      contract:contracts(id, jobs(title)),
      opened_by:profiles(id, full_name)
    `)
    .order("created_at", { ascending: false });

  const disputes = data ?? [];

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
                <p className="text-lg font-semibold text-foreground">{dispute.contract?.jobs?.title ?? "Contract"}</p>
                <p className="text-xs text-muted">Opened by {dispute.opened_by?.full_name ?? "User"}</p>
                <p className="text-xs text-muted">{new Date(dispute.created_at).toLocaleString()}</p>
              </div>
              <Badge variant="muted">{dispute.status}</Badge>
            </div>
            <p className="text-sm text-muted">Reason: {dispute.reason}</p>
            {dispute.resolution ? <p className="text-sm text-muted">Resolution: {dispute.resolution}</p> : null}
            <div className="flex items-center gap-3 text-sm">
              <Link href={`/contracts/${dispute.contract?.id ?? ""}`} className="text-accent underline">
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

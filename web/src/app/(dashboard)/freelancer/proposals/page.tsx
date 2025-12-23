import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, getDBAsync } from "@/lib/auth/session";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WithdrawProposalButton } from "@/components/freelancer/proposals/withdraw-button";

interface ProposalWithJob {
  id: string;
  job_id: string;
  status: string;
  bid_amount: number;
  bid_type: string;
  estimated_hours: number | null;
  created_at: string;
  job_title: string | null;
  job_category: string | null;
  job_budget_mode: string | null;
  job_budget_min: number | null;
  job_budget_max: number | null;
}

export default async function ProposalsPage() {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/signin");
  }

  const d1 = await getDBAsync();
  let proposals: ProposalWithJob[] = [];

  if (d1) {
    try {
      const { results } = await d1
        .prepare(`
          SELECT 
            p.id,
            p.job_id,
            p.status,
            p.bid_amount,
            p.bid_type,
            p.estimated_hours,
            p.created_at,
            j.title as job_title,
            j.category as job_category,
            j.budget_mode as job_budget_mode,
            j.budget_min as job_budget_min,
            j.budget_max as job_budget_max
          FROM proposals p
          LEFT JOIN jobs j ON p.job_id = j.id
          WHERE p.freelancer_id = ?
          ORDER BY p.created_at DESC
        `)
        .bind(auth.profile.id)
        .all<ProposalWithJob>();
      
      proposals = results ?? [];
    } catch (error) {
      console.error("Failed to fetch proposals:", error);
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Your proposals</h1>
        <p className="text-sm text-muted">Monitor client responses, withdraw offers, or follow up with personalized messages.</p>
      </div>

      <div className="grid gap-4">
        {proposals.length === 0 ? (
          <Card className="border-dashed p-6 text-center text-sm text-muted">
            You have not sent any proposals yet. <Link href="/freelancer/jobs" className="text-accent underline">Browse jobs</Link> to get started.
          </Card>
        ) : (
          proposals.map((proposal) => (
            <Card key={proposal.id} className="flex flex-col gap-4 border border-card-border/70 p-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-foreground">{proposal.job_title ?? "Job unavailable"}</h2>
                  <Badge variant="muted">{proposal.status}</Badge>
                </div>
                <p className="text-sm text-muted">
                  Bid {proposal.bid_type === "hourly" ? "$" : "৳"}
                  {proposal.bid_amount}
                  {proposal.bid_type === "hourly" && proposal.estimated_hours ? ` · est. ${proposal.estimated_hours} hours` : null}
                </p>
                <p className="text-xs uppercase text-muted">Sent {new Date(proposal.created_at).toLocaleDateString()}</p>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="ghost" asChild size="sm">
                  <Link href={`/freelancer/jobs/${proposal.job_id}`}>View job</Link>
                </Button>
                <WithdrawProposalButton proposalId={proposal.id} disabled={proposal.status !== "submitted" && proposal.status !== "shortlisted"} />
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WithdrawProposalButton } from "@/components/freelancer/proposals/withdraw-button";
import type { Tables } from "@/types/database";

type ProposalRow = Tables<"proposals">;

type JobSummary = Pick<Tables<"jobs">, "id" | "title" | "category" | "budget_mode" | "budget_min" | "budget_max">;

type SupabaseProposalRecord = ProposalRow & {
  jobs: JobSummary | JobSummary[] | null;
};

type ProposalWithJob = ProposalRow & {
  job: JobSummary | null;
};

export default async function ProposalsPage() {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/signin");
  }

  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("proposals")
    .select(
      `
      id,
      job_id,
      status,
      bid_amount,
      bid_type,
      estimated_hours,
      created_at,
      jobs (
        id,
        title,
        category,
        budget_mode,
        budget_min,
        budget_max
      )
    `,
    )
    .eq("freelancer_id", auth.profile.id)
    .order("created_at", { ascending: false });

  const proposals: ProposalWithJob[] = ((data ?? []) as SupabaseProposalRecord[]).map(({ jobs, ...proposal }) => ({
    ...proposal,
    job: Array.isArray(jobs) ? jobs[0] ?? null : jobs ?? null,
  }));

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
                  <h2 className="text-lg font-semibold text-foreground">{proposal.job?.title ?? "Job unavailable"}</h2>
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

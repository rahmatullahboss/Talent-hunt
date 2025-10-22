import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JobStatusForm } from "@/components/employer/jobs/job-status-form";
import { HireProposalForm } from "@/components/employer/jobs/hire-proposal-form";
import type { Tables } from "@/types/database";

type FreelancerSummary = Pick<
  Tables<"profiles">,
  "id" | "full_name" | "title" | "bio" | "hourly_rate" | "skills" | "avatar_url"
>;

type ProposalRow = Tables<"proposals">;

type SupabaseProposalRecord = ProposalRow & {
  freelancer?: FreelancerSummary | FreelancerSummary[] | null;
};

type ProposalWithFreelancer = ProposalRow & {
  freelancer: FreelancerSummary | null;
};

type EmployerJobRecord = Tables<"jobs"> & {
  proposals: SupabaseProposalRecord[] | null;
};

interface EmployerJobDetailProps {
  params: {
    id: string;
  };
}

export default async function EmployerJobDetailPage({ params }: EmployerJobDetailProps) {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/signin");
  }

  const supabase = createSupabaseServerClient();
  const { data: job } = await supabase
    .from("jobs")
    .select(`
      id,
      title,
      description,
      status,
      budget_mode,
      budget_min,
      budget_max,
      skills,
      experience_level,
      created_at,
      proposals:proposals(
        id,
        status,
        cover_letter,
        bid_amount,
        bid_type,
        estimated_hours,
        created_at,
        freelancer:profiles(
          id,
          full_name,
          title,
          bio,
          hourly_rate,
          skills,
          avatar_url
        )
      )
    `)
    .eq("id", params.id)
    .eq("employer_id", auth.profile.id)
    .maybeSingle();

  if (!job) {
    notFound();
  }

  const typedJob = {
    ...job,
    proposals: (job.proposals ?? []) as SupabaseProposalRecord[] | null,
  } as EmployerJobRecord;

  const proposals: ProposalWithFreelancer[] = (typedJob.proposals ?? []).map((proposal) => {
    const freelancerCandidate = Array.isArray(proposal.freelancer) ? proposal.freelancer[0] : proposal.freelancer;

    return {
      ...proposal,
      freelancer: freelancerCandidate ?? null,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <Badge variant="muted">{typedJob.status}</Badge>
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">{typedJob.title}</h1>
          <p className="text-sm text-muted">Posted {new Date(typedJob.created_at).toLocaleString()}</p>
        </div>
        <JobStatusForm jobId={typedJob.id} currentStatus={typedJob.status} />
      </div>

      <Card className="space-y-4 border border-card-border/70 bg-card/80 p-6">
        <h2 className="text-xl font-semibold text-foreground">Project overview</h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">{typedJob.description}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
          <span>Experience: {typedJob.experience_level}</span>
          <span>
            Budget: {typedJob.budget_mode === "hourly" ? "$" : "?"}
            {typedJob.budget_min ?? "-"}
            {typedJob.budget_max ? ` - ${typedJob.budget_mode === "hourly" ? "$" : "?"}${typedJob.budget_max}` : ""}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {typedJob.skills?.map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
        </div>
      </Card>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Proposals ({proposals.length})</h2>
          <Button variant="ghost" asChild>
            <Link href="/employer/freelancers">Invite freelancers</Link>
          </Button>
        </div>
        {proposals.length ? (
          <div className="grid gap-4">
            {proposals.map((proposal) => (
              <Card key={proposal.id} className="space-y-4 border border-card-border/70 bg-card/80 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{proposal.freelancer?.full_name}</p>
                    <p className="text-sm text-muted">{proposal.freelancer?.title ?? "No headline"}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
                      {proposal.freelancer?.skills?.slice(0, 6).map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-muted">
                    <p>
                      Bid: {proposal.bid_type === "hourly" ? "$" : "?"}
                      {proposal.bid_amount}
                    </p>
                    {proposal.estimated_hours ? <p>Est. hours: {proposal.estimated_hours}</p> : null}
                    <p>Submitted {new Date(proposal.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Cover letter</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{proposal.cover_letter}</p>
                </div>
                {proposal.status !== "hired" ? (
                  <HireProposalForm jobId={typedJob.id} proposalId={proposal.id} defaultAmount={proposal.bid_amount} />
                ) : null}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed p-6 text-sm text-muted">
            No proposals yet. Share the job link with your network or invite freelancers directly.
          </Card>
        )}
      </section>
    </div>
  );
}

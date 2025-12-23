import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser, getDBAsync } from "@/lib/auth/session";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JobStatusForm } from "@/components/employer/jobs/job-status-form";
import { HireProposalForm } from "@/components/employer/jobs/hire-proposal-form";
import { fromJsonArray } from "@/lib/db";

interface JobRow {
  id: string;
  title: string;
  description: string;
  status: string;
  budget_mode: string;
  budget_min: number | null;
  budget_max: number | null;
  skills: string | null;
  experience_level: string;
  created_at: string;
}

interface ProposalRow {
  id: string;
  status: string;
  cover_letter: string | null;
  bid_amount: number;
  bid_type: string;
  estimated_hours: number | null;
  created_at: string;
  freelancer_id: string;
  freelancer_name: string | null;
  freelancer_title: string | null;
  freelancer_bio: string | null;
  freelancer_hourly_rate: number | null;
  freelancer_skills: string | null;
  freelancer_avatar_url: string | null;
}

interface EmployerJobDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EmployerJobDetailPage({ params }: EmployerJobDetailProps) {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/signin");
  }

  const { id } = await params;
  const d1 = await getDBAsync();
  
  if (!d1) {
    notFound();
  }

  let job: JobRow | null = null;
  let proposals: ProposalRow[] = [];

  try {
    job = await d1
      .prepare(`
        SELECT id, title, description, status, budget_mode, budget_min, budget_max, skills, experience_level, created_at
        FROM jobs
        WHERE id = ? AND employer_id = ?
      `)
      .bind(id, auth.profile.id)
      .first<JobRow>();

    if (job) {
      const { results } = await d1
        .prepare(`
          SELECT 
            p.id,
            p.status,
            p.cover_letter,
            p.bid_amount,
            p.bid_type,
            p.estimated_hours,
            p.created_at,
            p.freelancer_id,
            pr.full_name as freelancer_name,
            pr.title as freelancer_title,
            pr.bio as freelancer_bio,
            pr.hourly_rate as freelancer_hourly_rate,
            pr.skills as freelancer_skills,
            pr.avatar_url as freelancer_avatar_url
          FROM proposals p
          LEFT JOIN profiles pr ON p.freelancer_id = pr.id
          WHERE p.job_id = ?
          ORDER BY p.created_at DESC
        `)
        .bind(id)
        .all<ProposalRow>();

      proposals = results ?? [];
    }
  } catch (error) {
    console.error("Failed to fetch job details:", error);
  }

  if (!job) {
    notFound();
  }

  const jobSkills = fromJsonArray(job.skills);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <Badge variant="muted">{job.status}</Badge>
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">{job.title}</h1>
          <p className="text-sm text-muted">Posted {new Date(job.created_at).toLocaleString()}</p>
        </div>
        <JobStatusForm jobId={job.id} currentStatus={job.status} />
      </div>

      <Card className="space-y-4 border border-card-border/70 bg-card/80 p-6">
        <h2 className="text-xl font-semibold text-foreground">Project overview</h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">{job.description}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
          <span>Experience: {job.experience_level}</span>
          <span>
            Budget: {job.budget_mode === "hourly" ? "$" : "৳"}
            {job.budget_min ?? "-"}
            {job.budget_max ? ` - ${job.budget_mode === "hourly" ? "$" : "৳"}${job.budget_max}` : ""}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {jobSkills.map((skill) => (
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
            {proposals.map((proposal) => {
              const freelancerSkills = fromJsonArray(proposal.freelancer_skills);
              return (
                <Card key={proposal.id} className="space-y-4 border border-card-border/70 bg-card/80 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-foreground">{proposal.freelancer_name}</p>
                      <p className="text-sm text-muted">{proposal.freelancer_title ?? "No headline"}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
                        {freelancerSkills.slice(0, 6).map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-muted">
                      <p>
                        Bid: {proposal.bid_type === "hourly" ? "$" : "৳"}
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
                    <HireProposalForm jobId={job.id} proposalId={proposal.id} defaultAmount={proposal.bid_amount} />
                  ) : null}
                </Card>
              );
            })}
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

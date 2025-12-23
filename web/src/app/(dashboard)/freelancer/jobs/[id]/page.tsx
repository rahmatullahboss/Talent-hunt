import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BookmarkMinus } from "lucide-react";
import Link from "next/link";
import { getCurrentUser, getDBAsync } from "@/lib/auth/session";
import { ProposalForm } from "@/components/freelancer/jobs/proposal-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fromJsonArray } from "@/lib/db";

interface JobRow {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_mode: string;
  budget_min: number | null;
  budget_max: number | null;
  experience_level: string;
  skills: string | null;
  deadline: string | null;
  created_at: string;
  employer_name: string | null;
  employer_company: string | null;
  employer_title: string | null;
  employer_location: string | null;
  employer_bio: string | null;
}

interface ExistingProposal {
  id: string;
  status: string;
}

interface JobDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
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
  let proposalCount = 0;
  let existingProposal: ExistingProposal | null = null;

  try {
    job = await d1
      .prepare(`
        SELECT 
          j.id,
          j.title,
          j.description,
          j.category,
          j.budget_mode,
          j.budget_min,
          j.budget_max,
          j.experience_level,
          j.skills,
          j.deadline,
          j.created_at,
          p.full_name as employer_name,
          p.company_name as employer_company,
          p.title as employer_title,
          p.location as employer_location,
          p.bio as employer_bio
        FROM jobs j
        LEFT JOIN profiles p ON j.employer_id = p.id
        WHERE j.id = ?
      `)
      .bind(id)
      .first<JobRow>();

    if (job) {
      const countResult = await d1
        .prepare(`SELECT COUNT(*) as count FROM proposals WHERE job_id = ?`)
        .bind(id)
        .first<{ count: number }>();
      proposalCount = countResult?.count ?? 0;

      existingProposal = await d1
        .prepare(`SELECT id, status FROM proposals WHERE job_id = ? AND freelancer_id = ?`)
        .bind(id, auth.profile.id)
        .first<ExistingProposal>();
    }
  } catch (error) {
    console.error("Failed to fetch job details:", error);
  }

  if (!job) {
    notFound();
  }

  const skills = fromJsonArray(job.skills);

  return (
    <div className="space-y-8">
      <Button variant="ghost" asChild>
        <Link href="/freelancer/jobs">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to jobs
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="space-y-6 p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Badge variant="muted">{job.category}</Badge>
              <h1 className="mt-2 text-3xl font-semibold text-foreground">{job.title}</h1>
              <p className="mt-1 text-sm text-muted">Posted {formatDistanceFromNow(job.created_at)}</p>
            </div>
            <Button variant="ghost" size="icon" aria-label="Save job">
              <BookmarkMinus className="h-5 w-5 text-muted" />
            </Button>
          </div>

          <section className="grid gap-4 md:grid-cols-3">
            <JobMeta label="Budget" value={`${job.budget_mode === "hourly" ? "$" : "৳"}${job.budget_min ?? "-"} - ${job.budget_max ?? "-"}`} />
            <JobMeta label="Experience" value={job.experience_level} />
            <JobMeta label="Proposals" value={proposalCount} />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Project overview</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted">{job.description}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Skills & tools</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.length ? skills.map((skill) => <Badge key={skill}>{skill}</Badge>) : (
                <p className="text-sm text-muted">No skills specified.</p>
              )}
            </div>
          </section>
        </Card>

        <Card className="space-y-5 border border-card-border/70 p-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Client details</h2>
            <p className="mt-2 text-sm text-muted">{job.employer_company ?? job.employer_name}</p>
            {job.employer_location ? <p className="text-xs text-muted">Based in {job.employer_location}</p> : null}
          </div>
          <p className="text-sm text-muted">{job.employer_bio ?? "Client bio not provided."}</p>
          {existingProposal ? (
            <div className="rounded-[var(--radius-md)] border border-accent/50 bg-accent/10 p-4 text-sm text-accent">
              You already submitted a proposal. Current status: {existingProposal.status}.
            </div>
          ) : (
            <ProposalForm jobId={job.id} jobTitle={job.title} jobDescription={job.description} />
          )}
        </Card>
      </div>
    </div>
  );
}

function JobMeta({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-card-border/60 bg-foreground/5 p-4 text-sm">
      <p className="text-muted">{label}</p>
      <p className="mt-1 font-semibold text-foreground">{value}</p>
    </div>
  );
}

function formatDistanceFromNow(dateString: string) {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) {
    return "Just now";
  }
  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }
  const diffWeeks = Math.round(diffDays / 7);
  return `${diffWeeks} weeks ago`;
}

import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BookmarkMinus } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProposalForm } from "@/components/freelancer/jobs/proposal-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface JobDetailPageProps {
  params: {
    id: string;
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/auth/signin");
  }

  const supabase = createSupabaseServerClient();
  const { data: job, error } = await supabase
    .from("jobs")
    .select(
      `
      id,
      title,
      description,
      category,
      budget_mode,
      budget_min,
      budget_max,
      experience_level,
      skills,
      deadline,
      created_at,
      employer:profiles!jobs_employer_id_fkey (
        full_name,
        company_name,
        title,
        location,
        bio
      ),
      proposals(count)
    `,
    )
    .eq("id", params.id)
    .single();

  if (error || !job) {
    notFound();
  }

  const { data: existingProposal } = await supabase
    .from("proposals")
    .select("id, status")
    .eq("job_id", job.id)
    .eq("freelancer_id", auth.profile.id)
    .maybeSingle();

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
            <JobMeta label="Budget" value={`${job.budget_mode === "hourly" ? "$" : "৳"}${job.budget_min ?? "—"} - ${job.budget_max ?? "—"}`} />
            <JobMeta label="Experience" value={job.experience_level} />
            <JobMeta label="Proposals" value={job.proposals?.[0]?.count ?? 0} />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Project overview</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted">{job.description}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Skills & tools</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {job.skills?.length ? job.skills.map((skill: string) => <Badge key={skill}>{skill}</Badge>) : <p className="text-sm text-muted">No skills specified.</p>}
            </div>
          </section>
        </Card>

        <Card className="space-y-5 border border-card-border/70 p-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Client details</h2>
            <p className="mt-2 text-sm text-muted">{job.employer?.company_name ?? job.employer?.full_name}</p>
            {job.employer?.location ? <p className="text-xs text-muted">Based in {job.employer.location}</p> : null}
          </div>
          <p className="text-sm text-muted">{job.employer?.bio ?? "Client bio not provided."}</p>
          {existingProposal ? (
            <div className="rounded-[var(--radius-md)] border border-accent/50 bg-accent/10 p-4 text-sm text-accent">
              You already submitted a proposal. Current status: {existingProposal.status}.
            </div>
          ) : (
            <ProposalForm jobId={job.id} />
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

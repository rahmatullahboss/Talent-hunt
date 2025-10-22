import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JobStatusForm } from "@/components/employer/jobs/job-status-form";

export default async function EmployerJobsPage() {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/auth/signin");
  }

  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("jobs")
    .select("id, title, status, created_at, proposals(count)")
    .eq("employer_id", auth.profile.id)
    .order("created_at", { ascending: false });

  const jobs = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Your job posts</h1>
          <p className="text-sm text-muted">Track live postings, manage proposals, and keep your project pipeline organised.</p>
        </div>
        <Button asChild>
          <Link href="/employer/jobs/new">Post another job</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {jobs.length === 0 ? (
          <Card className="border-dashed p-6 text-sm text-muted">
            You haven&apos;t posted any jobs yet. <Link href="/employer/jobs/new" className="text-accent underline">Create your first listing</Link> to attract top talent.
          </Card>
        ) : (
          jobs.map((job) => (
            <Card key={job.id} className="flex flex-col gap-4 border border-card-border/70 bg-card/80 p-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">{job.title}</h2>
                  <Badge variant="muted">{job.status}</Badge>
                </div>
                <p className="text-xs text-muted">Posted {new Date(job.created_at).toLocaleString()}</p>
                <p className="text-sm text-muted">{job.proposals?.[0]?.count ?? 0} proposals received</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" asChild size="sm">
                  <Link href={`/employer/jobs/${job.id}`}>View details</Link>
                </Button>
                <JobStatusForm jobId={job.id} currentStatus={job.status} />
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

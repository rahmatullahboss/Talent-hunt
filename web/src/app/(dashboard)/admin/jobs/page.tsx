import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CancelJobButton } from "@/components/admin/cancel-job-button";

export default async function AdminJobsPage() {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/auth/signin");
  }

  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("jobs")
    .select("id, title, status, created_at, employer:profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  const jobs = data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Jobs</h1>
        <p className="text-sm text-muted">Review recent postings and remove content that fails moderation guidelines.</p>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => {
          const employer = Array.isArray(job.employer) ? job.employer[0] : job.employer;
          const employerName = employer?.full_name ?? "Unknown";

          return (
            <Card key={job.id} className="flex flex-col gap-3 border border-card-border/70 bg-card/80 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-semibold text-foreground">{job.title}</p>
                <p className="text-xs text-muted">Employer: {employerName}</p>
                <p className="text-xs text-muted">Posted {new Date(job.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="muted">{job.status}</Badge>
                <ButtonGroup jobId={job.id} isCancelled={job.status === "cancelled"} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ButtonGroup({ jobId, isCancelled }: { jobId: string; isCancelled: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Link href={`/employer/jobs/${jobId}`} className="text-sm text-accent underline">
        View
      </Link>
      <CancelJobButton jobId={jobId} disabled={isCancelled} />
    </div>
  );
}

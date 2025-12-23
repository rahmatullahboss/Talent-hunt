import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, getDB } from "@/lib/auth/session";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CancelJobButton } from "@/components/admin/cancel-job-button";

interface Job {
  id: string;
  title: string;
  status: string;
  created_at: string;
  employer_name: string | null;
}

export default async function AdminJobsPage() {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/signin");
  }

  const db = getDB();
  if (!db) {
    return <div>Database not available</div>;
  }

  const result = await db.prepare(`
    SELECT j.id, j.title, j.status, j.created_at, p.full_name as employer_name
    FROM jobs j
    LEFT JOIN profiles p ON j.employer_id = p.id
    ORDER BY j.created_at DESC
    LIMIT 100
  `).all<Job>();

  const jobs = result.results ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Jobs</h1>
        <p className="text-sm text-muted">Review recent postings and remove content that fails moderation guidelines.</p>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="flex flex-col gap-3 border border-card-border/70 bg-card/80 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-semibold text-foreground">{job.title}</p>
              <p className="text-xs text-muted">Employer: {job.employer_name ?? "Unknown"}</p>
              <p className="text-xs text-muted">Posted {new Date(job.created_at).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="muted">{job.status}</Badge>
              <ButtonGroup jobId={job.id} isCancelled={job.status === "cancelled"} />
            </div>
          </Card>
        ))}
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

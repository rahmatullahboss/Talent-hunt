import Link from "next/link";
import { Bookmark, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/types/database";

type Job = Pick<Tables<"jobs">, "id" | "title" | "category" | "budget_mode" | "budget_min" | "budget_max" | "skills" | "created_at" | "experience_level"> & {
  proposals_count?: number;
};

export function JobCard({ job }: { job: Job }) {
  const postedAgo = formatDistanceFromNow(job.created_at);

  return (
    <Card className="flex flex-col gap-4 border border-card-border/70 bg-card/70 p-6 hover:border-accent/40 hover:shadow-lg">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Badge variant="muted">{job.category}</Badge>
          <h3 className="mt-2 text-xl font-semibold text-foreground">{job.title}</h3>
        </div>
        <Button variant="ghost" size="icon" aria-label="Save job">
          <Bookmark className="h-5 w-5 text-muted" />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
        <span className="flex items-center gap-2">
          <Clock className="h-4 w-4" /> {postedAgo}
        </span>
        <span>Experience: {job.experience_level}</span>
        <span>
          Budget: {job.budget_mode === "hourly" ? "$" : "৳"}
          {job.budget_min ?? "—"} {job.budget_max ? `- ${job.budget_mode === "hourly" ? "$" : "৳"}${job.budget_max}` : null}
        </span>
        {typeof job.proposals_count === "number" ? <span>{job.proposals_count} proposals</span> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {job.skills?.slice(0, 6).map((skill) => (
          <Badge key={skill} variant="outline" className="border-accent/30 text-muted">
            {skill}
          </Badge>
        ))}
      </div>
      <Button asChild>
        <Link href={`/freelancer/jobs/${job.id}`}>View details</Link>
      </Button>
    </Card>
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
    return `${diffHours}h ago`;
  }
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  const diffWeeks = Math.round(diffDays / 7);
  return `${diffWeeks}w ago`;
}

import { redirect } from "next/navigation";
import { getCurrentUser, getDB } from "@/lib/auth/session";
import { JobFilters } from "@/components/freelancer/jobs/job-filters";
import { JobCard } from "@/components/freelancer/jobs/job-card";
import { Card } from "@/components/ui/card";
import { fromJsonArray } from "@/lib/db";

interface JobsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    experience?: string;
    minBudget?: string;
    maxBudget?: string;
    skills?: string;
  }>;
}

interface Job {
  id: string;
  title: string;
  category: string;
  budget_mode: "fixed" | "hourly";
  budget_min: number | null;
  budget_max: number | null;
  skills: string;
  experience_level: "entry" | "mid" | "expert";
  created_at: string;
  proposals_count: number;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/signin");
  }

  const db = getDB();
  if (!db) {
    return <div>Database not available</div>;
  }

  const params = await searchParams;
  const { q, category, experience, minBudget, maxBudget, skills: skillsParam } = params;

  // Build query with filters
  let whereClause = "WHERE j.status = 'open'";
  const bindings: (string | number)[] = [];

  if (q) {
    whereClause += " AND (j.title LIKE ? OR j.description LIKE ?)";
    bindings.push(`%${q}%`, `%${q}%`);
  }

  if (category) {
    whereClause += " AND j.category = ?";
    bindings.push(category);
  }

  if (experience) {
    whereClause += " AND j.experience_level = ?";
    bindings.push(experience);
  }

  if (minBudget) {
    whereClause += " AND j.budget_min >= ?";
    bindings.push(Number(minBudget));
  }

  if (maxBudget) {
    whereClause += " AND j.budget_max <= ?";
    bindings.push(Number(maxBudget));
  }

  const result = await db.prepare(`
    SELECT j.id, j.title, j.category, j.budget_mode, j.budget_min, j.budget_max, j.skills, j.experience_level, j.created_at,
           (SELECT COUNT(*) FROM proposals p WHERE p.job_id = j.id) as proposals_count
    FROM jobs j
    ${whereClause}
    ORDER BY j.created_at DESC
    LIMIT 30
  `).bind(...bindings).all<Job>();

  const jobs = result.results ?? [];
  const selectedSkills = skillsParam?.split(",").filter(Boolean) ?? [];
  const profileSkills = fromJsonArray(auth.profile.skills);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Explore open projects</h1>
        <p className="text-base text-muted">Use filters to find the projects that match your expertise and rate expectations.</p>
      </div>

      <JobFilters
        key={`${JSON.stringify({ q: q ?? "", category: category ?? "", experience: experience ?? "", minBudget: minBudget ?? "", maxBudget: maxBudget ?? "" })}-${selectedSkills.join(",")}`}
        defaultSkills={profileSkills}
        initialSelectedSkills={selectedSkills.length ? selectedSkills : profileSkills.slice(0, 6)}
        initialFilters={{
          q: q ?? "",
          category: category ?? "",
          experience: experience ?? "",
          minBudget: minBudget ?? "",
          maxBudget: maxBudget ?? "",
        }}
      />

      <div className="grid gap-4">
        {jobs.length === 0 ? (
          <Card className="border-dashed p-8 text-center text-sm text-muted">No jobs found. Adjust filters or try a different search term.</Card>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={{ ...job, skills: fromJsonArray(job.skills) }} />)
        )}
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { JobFilters } from "@/components/freelancer/jobs/job-filters";
import { JobCard } from "@/components/freelancer/jobs/job-card";
import { Card } from "@/components/ui/card";

interface JobsPageProps {
  searchParams: {
    q?: string;
    category?: string;
    experience?: string;
    minBudget?: string;
    maxBudget?: string;
    skills?: string;
  };
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/signin");
  }

  const supabase = createSupabaseServerClient();
  let query = supabase
    .from("jobs")
    .select("id, title, category, budget_mode, budget_min, budget_max, skills, experience_level, created_at, proposals(count)")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  const { q, category, experience, minBudget, maxBudget, skills: skillsParam } = searchParams;

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }

  if (category) {
    query = query.eq("category", category);
  }

  if (experience) {
    query = query.eq("experience_level", experience);
  }

  if (minBudget) {
    query = query.gte("budget_min", Number(minBudget));
  }

  if (maxBudget) {
    query = query.lte("budget_max", Number(maxBudget));
  }

  const selectedSkills = skillsParam?.split(",").filter(Boolean) ?? [];
  if (skillsParam) {
    const skillArray = skillsParam.split(",").filter(Boolean);
    if (skillArray.length) {
      query = query.contains("skills", skillArray);
    }
  }

  const { data } = await query.limit(30);

  const jobs =
    data?.map((item) => ({
      ...item,
      proposals_count: item.proposals?.[0]?.count ?? 0,
    })) ?? [];

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Explore open projects</h1>
        <p className="text-base text-muted">Use filters to find the projects that match your expertise and rate expectations.</p>
      </div>

      <JobFilters
        key={`${JSON.stringify({ q: q ?? "", category: category ?? "", experience: experience ?? "", minBudget: minBudget ?? "", maxBudget: maxBudget ?? "" })}-${selectedSkills.join(",")}`}
        defaultSkills={auth.profile.skills}
        initialSelectedSkills={selectedSkills.length ? selectedSkills : auth.profile.skills.slice(0, 6)}
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
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import { getCurrentUser, getDBAsync } from "@/lib/auth/session";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FreelancerFilters } from "@/components/employer/freelancers/filters";
import { fromJsonArray } from "@/lib/db";

interface FreelancersPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

interface FreelancerProfile {
  id: string;
  full_name: string;
  title: string | null;
  bio: string | null;
  hourly_rate: number | null;
  skills: string | null;
  avatar_url: string | null;
}

export default async function FreelancersPage({ searchParams }: FreelancersPageProps) {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/signin");
  }

  const params = await searchParams;
  const query = params.q?.trim().toLowerCase() ?? "";
  
  const d1 = await getDBAsync();
  if (!d1) {
    return (
      <div className="space-y-6">
        <Card className="border-dashed p-6 text-sm text-muted">
          Database connection unavailable. Please try again later.
        </Card>
      </div>
    );
  }

  // Query freelancers from D1
  let freelancers: FreelancerProfile[] = [];
  
  try {
    if (query) {
      // Search with query
      const { results } = await d1
        .prepare(`
          SELECT id, full_name, title, bio, hourly_rate, skills, avatar_url
          FROM profiles
          WHERE role = 'freelancer'
            AND onboarding_complete = 1
            AND (
              LOWER(full_name) LIKE ?
              OR LOWER(title) LIKE ?
              OR LOWER(bio) LIKE ?
            )
          ORDER BY updated_at DESC
          LIMIT 30
        `)
        .bind(`%${query}%`, `%${query}%`, `%${query}%`)
        .all<FreelancerProfile>();
      
      freelancers = results ?? [];
    } else {
      // Get all freelancers
      const { results } = await d1
        .prepare(`
          SELECT id, full_name, title, bio, hourly_rate, skills, avatar_url
          FROM profiles
          WHERE role = 'freelancer'
            AND onboarding_complete = 1
          ORDER BY updated_at DESC
          LIMIT 30
        `)
        .all<FreelancerProfile>();
      
      freelancers = results ?? [];
    }
  } catch (error) {
    console.error("Failed to fetch freelancers:", error);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Discover freelancers</h1>
        <p className="text-sm text-muted">Search across the marketplace and invite professionals that match your project requirements.</p>
      </div>

      <FreelancerFilters initialQuery={query} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {freelancers.length === 0 ? (
          <Card className="border-dashed p-6 text-sm text-muted md:col-span-2 xl:col-span-3">
            {query 
              ? "No freelancers match your search. Try different keywords or broaden your filters."
              : "No freelancers have completed their profiles yet. Check back later!"}
          </Card>
        ) : (
          freelancers.map((freelancer) => {
            const skills = fromJsonArray(freelancer.skills);
            return (
              <Card key={freelancer.id} className="flex h-full flex-col gap-3 border border-card-border/70 bg-card/80 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{freelancer.full_name}</p>
                    <p className="text-sm text-muted">{freelancer.title ?? "No headline"}</p>
                  </div>
                  {freelancer.hourly_rate ? <Badge variant="muted">${freelancer.hourly_rate}/hr</Badge> : null}
                </div>
                <p className="line-clamp-2 text-sm text-muted">{freelancer.bio ?? "No bio added yet."}</p>
                <div className="flex flex-wrap gap-2 text-xs text-muted">
                  {skills.slice(0, 5).map((skill: string) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                  {skills.length > 5 && (
                    <Badge variant="outline">+{skills.length - 5}</Badge>
                  )}
                </div>
                <Button variant="ghost" className="mt-auto w-fit" asChild>
                  <a href={`/freelancer/${freelancer.id}`}>View profile</a>
                </Button>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

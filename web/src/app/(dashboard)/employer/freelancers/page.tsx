import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FreelancerFilters } from "@/components/employer/freelancers/filters";

interface FreelancersPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function FreelancersPage({ searchParams }: FreelancersPageProps) {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/auth/signin");
  }

  const query = searchParams.q?.trim() ?? "";
  const supabase = createSupabaseServerClient();

  let request = supabase
    .from("profiles")
    .select("id, full_name, title, bio, hourly_rate, skills, avatar_url")
    .eq("role", "freelancer")
    .order("updated_at", { ascending: false })
    .limit(30);

  if (query) {
    request = request.or(`full_name.ilike.%${query}%,title.ilike.%${query}%,bio.ilike.%${query}%`);
  }

  const { data } = await request;
  const freelancers = data ?? [];

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
            No freelancers match your search. Try different keywords or broaden your filters.
          </Card>
        ) : (
          freelancers.map((freelancer) => (
            <Card key={freelancer.id} className="flex h-full flex-col gap-3 border border-card-border/70 bg-card/80 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-foreground">{freelancer.full_name}</p>
                  <p className="text-sm text-muted">{freelancer.title ?? "No headline"}</p>
                </div>
                {freelancer.hourly_rate ? <Badge variant="muted">${freelancer.hourly_rate}/hr</Badge> : null}
              </div>
              <p className="text-sm text-muted">{freelancer.bio ?? "No bio added yet."}</p>
              <div className="flex flex-wrap gap-2 text-xs text-muted">
                {freelancer.skills?.slice(0, 6).map((skill: string) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
              <Button variant="ghost" className="w-fit" asChild>
                <a href={`mailto:${auth.user.email}?subject=TalentHunt BD Collaboration`}>
                  Contact
                </a>
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

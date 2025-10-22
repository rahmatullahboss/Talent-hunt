import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PortfolioForm } from "@/components/freelancer/portfolio/portfolio-form";
import { DeletePortfolioButton } from "@/components/freelancer/portfolio/delete-button";

export default async function PortfolioPage() {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/auth/signin");
  }

  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("portfolio_items")
    .select("id, title, description, image_url, external_link, created_at")
    .eq("profile_id", auth.profile.id)
    .order("created_at", { ascending: false });

  const items = data ?? [];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Portfolio highlights</h1>
        <p className="text-sm text-muted">Showcase your best work to inspire confidence and help employers visualize the outcomes you deliver.</p>
      </div>

      <Card className="border border-card-border/70 bg-card/80 p-6">
        <h2 className="text-xl font-semibold text-foreground">Add a new project</h2>
        <p className="mt-1 text-sm text-muted">Link to live demos, case studies, or visuals that demonstrate measurable impact.</p>
        <div className="mt-6">
          <PortfolioForm />
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.length === 0 ? (
          <Card className="border-dashed p-8 text-sm text-muted">No portfolio items yet. Share your strongest project to stand out in searches.</Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="flex h-full flex-col gap-4 border border-card-border/70 p-5">
              <div className="relative h-40 w-full overflow-hidden rounded-[var(--radius-md)] bg-foreground/5">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted">Add an image preview</div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="text-xs uppercase tracking-wide text-muted">Published {new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                  <DeletePortfolioButton itemId={item.id} />
                </div>
                <p className="text-sm text-muted">{item.description}</p>
                {item.external_link ? (
                  <a href={item.external_link} target="_blank" rel="noreferrer" className="text-sm text-accent underline">
                    View project
                  </a>
                ) : null}
              </div>
              <Badge variant="muted" className="w-fit">
                Impact
              </Badge>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

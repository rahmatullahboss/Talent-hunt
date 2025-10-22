import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function EmployerContractsPage() {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/auth/signin");
  }

  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("contracts")
    .select(
      `
      id,
      status,
      escrow_amount,
      created_at,
      notes,
      jobs ( id, title ),
      freelancer:profiles ( id, full_name, title )
    `,
    )
    .eq("employer_id", auth.profile.id)
    .order("created_at", { ascending: false });

  const contracts = data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Contracts</h1>
        <p className="text-sm text-muted">Monitor project progress, collaborate with freelancers, and finalise payouts after successful delivery.</p>
      </div>

      <div className="grid gap-4">
        {contracts.length === 0 ? (
          <Card className="border-dashed p-6 text-sm text-muted">No contracts yet. Hire a freelancer from your job proposals to create a contract.</Card>
        ) : (
          contracts.map((contract) => {
            const job = Array.isArray(contract.jobs) ? contract.jobs[0] : contract.jobs;
            const freelancer = Array.isArray(contract.freelancer) ? contract.freelancer[0] : contract.freelancer;

            return (
              <Card key={contract.id} className="flex flex-col gap-3 border border-card-border/70 bg-card/80 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{job?.title ?? "Contract"}</h2>
                    <p className="text-sm text-muted">{freelancer?.full_name ?? "Freelancer"}</p>
                  </div>
                  <Badge variant="muted">{contract.status}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                  <span>Escrow: ৳{Number(contract.escrow_amount ?? 0).toLocaleString()}</span>
                  <span>Created {new Date(contract.created_at).toLocaleString()}</span>
                </div>
                {contract.notes ? <p className="text-sm text-muted">Notes: {contract.notes}</p> : null}
                <Button variant="ghost" asChild className="w-fit">
                  <Link href={`/contracts/${contract.id}`}>Open workspace</Link>
                </Button>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

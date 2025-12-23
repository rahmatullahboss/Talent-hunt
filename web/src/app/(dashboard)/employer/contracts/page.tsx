import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, getDBAsync } from "@/lib/auth/session";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ContractRow {
  id: string;
  status: string;
  escrow_amount: number | null;
  created_at: string;
  notes: string | null;
  job_id: string | null;
  job_title: string | null;
  freelancer_id: string | null;
  freelancer_name: string | null;
  freelancer_title: string | null;
}

export default async function EmployerContractsPage() {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/signin");
  }

  const d1 = await getDBAsync();
  let contracts: ContractRow[] = [];

  if (d1) {
    try {
      const { results } = await d1
        .prepare(`
          SELECT 
            c.id,
            c.status,
            c.escrow_amount,
            c.created_at,
            c.notes,
            j.id as job_id,
            j.title as job_title,
            p.id as freelancer_id,
            p.full_name as freelancer_name,
            p.title as freelancer_title
          FROM contracts c
          LEFT JOIN jobs j ON c.job_id = j.id
          LEFT JOIN profiles p ON c.freelancer_id = p.id
          WHERE c.employer_id = ?
          ORDER BY c.created_at DESC
        `)
        .bind(auth.profile.id)
        .all<ContractRow>();

      contracts = results ?? [];
    } catch (error) {
      console.error("Failed to fetch contracts:", error);
    }
  }

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
          contracts.map((contract) => (
            <Card key={contract.id} className="flex flex-col gap-3 border border-card-border/70 bg-card/80 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{contract.job_title ?? "Contract"}</h2>
                  <p className="text-sm text-muted">{contract.freelancer_name ?? "Freelancer"}</p>
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
          ))
        )}
      </div>
    </div>
  );
}

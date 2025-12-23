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
  job_title: string | null;
  employer_name: string | null;
}

export default async function FreelancerContractsPage() {
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
            j.title as job_title,
            p.full_name as employer_name
          FROM contracts c
          LEFT JOIN jobs j ON c.job_id = j.id
          LEFT JOIN profiles p ON c.employer_id = p.id
          WHERE c.freelancer_id = ?
          ORDER BY c.created_at DESC
        `)
        .bind(auth.profile.id)
        .all<ContractRow>();

      contracts = results ?? [];
    } catch (error) {
      console.error("Failed to fetch contracts:", error);
    }
  }

  const activeContracts = contracts.filter(c => ["active", "submitted"].includes(c.status));
  const completedContracts = contracts.filter(c => c.status === "completed");
  const otherContracts = contracts.filter(c => !["active", "submitted", "completed"].includes(c.status));

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Your contracts</h1>
        <p className="text-sm text-muted">Track active projects, milestones, and collaboration with clients.</p>
      </div>

      {/* Active Contracts */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-foreground">Active contracts</h2>
          <Badge variant="muted">{activeContracts.length}</Badge>
        </div>
        
        {activeContracts.length === 0 ? (
          <Card className="border-dashed p-6 text-sm text-muted">
            No active contracts. Once a client hires you, your projects will appear here.
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeContracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </div>
        )}
      </section>

      {/* Completed Contracts */}
      {completedContracts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-foreground">Completed</h2>
            <Badge variant="success">{completedContracts.length}</Badge>
          </div>
          <div className="grid gap-4">
            {completedContracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </div>
        </section>
      )}

      {/* Other Contracts */}
      {otherContracts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Other contracts</h2>
          <div className="grid gap-4">
            {otherContracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ContractCard({ contract }: { contract: ContractRow }) {
  const statusVariant = 
    contract.status === "active" ? "success" : 
    contract.status === "completed" ? "muted" : 
    contract.status === "submitted" ? "outline" : "danger";

  return (
    <Card className="flex flex-col gap-3 border border-card-border/70 bg-card/80 p-5 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-foreground">{contract.job_title ?? "Contract"}</h3>
          <Badge variant={statusVariant}>{contract.status}</Badge>
        </div>
        <p className="text-sm text-muted">Client: {contract.employer_name ?? "Unknown"}</p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
          {contract.escrow_amount ? <span>Escrow: ৳{Number(contract.escrow_amount).toLocaleString()}</span> : null}
          <span>Started {new Date(contract.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      <Button variant="ghost" asChild>
        <Link href={`/contracts/${contract.id}`}>Open workspace</Link>
      </Button>
    </Card>
  );
}

import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MilestonesSection } from "@/components/contracts/milestones";
import { ContractChat } from "@/components/contracts/chat";

interface ContractPageProps {
  params: {
    id: string;
  };
}

export default async function ContractWorkspacePage({ params }: ContractPageProps) {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/auth/signin");
  }

  const supabase = createSupabaseServerClient();
  const { data: contract } = await supabase
    .from("contracts")
    .select(
      `
      id,
      status,
      notes,
      employer:profiles!contracts_employer_id_fkey ( id, full_name ),
      freelancer:profiles!contracts_freelancer_id_fkey ( id, full_name ),
      jobs ( id, title, description ),
      milestones:contract_milestones ( id, title, amount, status, due_date, deliverable_url, notes )
    `,
    )
    .eq("id", params.id)
    .maybeSingle();

  if (!contract) {
    notFound();
  }

  const isEmployer = contract.employer?.id === auth.profile.id;
  const isFreelancer = contract.freelancer?.id === auth.profile.id;
  const role = isEmployer ? "employer" : isFreelancer ? "freelancer" : auth.profile.role === "admin" ? "admin" : null;

  if (!role) {
    notFound();
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_id, content, created_at")
    .eq("contract_id", contract.id)
    .order("created_at", { ascending: true })
    .limit(200);

  const participants = [
    { id: contract.employer?.id ?? "", name: contract.employer?.full_name ?? "Employer" },
    { id: contract.freelancer?.id ?? "", name: contract.freelancer?.full_name ?? "Freelancer" },
  ];

  return (
    <div className="space-y-6">
      <Card className="space-y-3 border border-card-border/70 bg-card/80 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{contract.jobs?.title}</h1>
            <p className="text-sm text-muted">{contract.jobs?.description?.slice(0, 160)}...</p>
          </div>
          <Badge variant="muted">{contract.status}</Badge>
        </div>
        {contract.notes ? <p className="text-sm text-muted">Notes: {contract.notes}</p> : null}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <MilestonesSection contractId={contract.id} milestones={contract.milestones ?? []} role={role !}  />
        <Card className="border border-card-border/70 bg-card/80 p-4">
          <ContractChat
            contractId={contract.id}
            currentUserId={auth.profile.id}
            participants={participants}
            initialMessages={messages ?? []}
          />
        </Card>
      </div>
    </div>
  );
}

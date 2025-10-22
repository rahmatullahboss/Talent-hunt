import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MilestonesSection } from "@/components/contracts/milestones";
import { ContractChat } from "@/components/contracts/chat";
import type { Tables } from "@/types/database";

type ParticipantProfile = Pick<Tables<"profiles">, "id" | "full_name">;

type ContractJobSummary = Pick<Tables<"jobs">, "id" | "title" | "description">;

type ContractRecord = Tables<"contracts"> & {
  employer: ParticipantProfile | ParticipantProfile[] | null;
  freelancer: ParticipantProfile | ParticipantProfile[] | null;
  jobs: ContractJobSummary | ContractJobSummary[] | null;
  milestones: Tables<"contract_milestones">[] | null;
};

interface ContractPageProps {
  params: {
    id: string;
  };
}

export default async function ContractWorkspacePage({ params }: ContractPageProps) {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/signin");
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

  const typedContract = contract as ContractRecord;
  const employer = Array.isArray(typedContract.employer) ? typedContract.employer[0] ?? null : typedContract.employer ?? null;
  const freelancer = Array.isArray(typedContract.freelancer)
    ? typedContract.freelancer[0] ?? null
    : typedContract.freelancer ?? null;
  const job = Array.isArray(typedContract.jobs) ? typedContract.jobs[0] ?? null : typedContract.jobs ?? null;
  const milestones = typedContract.milestones ?? [];
  const jobSummary =
    job?.description && job.description.length > 160
      ? `${job.description.slice(0, 160)}...`
      : job?.description ?? "No job description provided.";

  const isEmployer = employer?.id === auth.profile.id;
  const isFreelancer = freelancer?.id === auth.profile.id;
  const role = isEmployer ? "employer" : isFreelancer ? "freelancer" : auth.profile.role === "admin" ? "admin" : null;

  if (!role) {
    notFound();
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_id, content, created_at")
    .eq("contract_id", typedContract.id)
    .order("created_at", { ascending: true })
    .limit(200);

  const participants = [
    { id: employer?.id ?? "", name: employer?.full_name ?? "Employer" },
    { id: freelancer?.id ?? "", name: freelancer?.full_name ?? "Freelancer" },
  ];

  return (
    <div className="space-y-6">
      <Card className="space-y-3 border border-card-border/70 bg-card/80 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{job?.title ?? "Contract"}</h1>
            <p className="text-sm text-muted">{jobSummary}</p>
          </div>
          <Badge variant="muted">{typedContract.status}</Badge>
        </div>
        {typedContract.notes ? <p className="text-sm text-muted">Notes: {typedContract.notes}</p> : null}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <MilestonesSection contractId={typedContract.id} milestones={milestones} role={role!} />
        <Card className="border border-card-border/70 bg-card/80 p-4">
          <ContractChat
            contractId={typedContract.id}
            currentUserId={auth.profile.id}
            participants={participants}
            initialMessages={messages ?? []}
          />
        </Card>
      </div>
    </div>
  );
}

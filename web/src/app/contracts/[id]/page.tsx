import { notFound, redirect } from "next/navigation";
import { getCurrentUser, getDBAsync } from "@/lib/auth/session";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MilestonesSection } from "@/components/contracts/milestones";
import { ContractChat } from "@/components/contracts/chat";

interface ContractRow {
  id: string;
  status: string;
  notes: string | null;
  employer_id: string;
  freelancer_id: string;
  employer_name: string | null;
  freelancer_name: string | null;
  job_id: string | null;
  job_title: string | null;
  job_description: string | null;
}

interface MilestoneRow {
  id: string;
  title: string;
  amount: number;
  status: string;
  due_date: string | null;
  deliverable_url: string | null;
  notes: string | null;
}

interface MessageRow {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface ContractPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ContractWorkspacePage({ params }: ContractPageProps) {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/signin");
  }

  const { id } = await params;
  const d1 = await getDBAsync();
  
  if (!d1) {
    notFound();
  }

  let contract: ContractRow | null = null;
  let milestones: MilestoneRow[] = [];
  let messages: MessageRow[] = [];

  try {
    contract = await d1
      .prepare(`
        SELECT 
          c.id,
          c.status,
          c.notes,
          c.employer_id,
          c.freelancer_id,
          e.full_name as employer_name,
          f.full_name as freelancer_name,
          j.id as job_id,
          j.title as job_title,
          j.description as job_description
        FROM contracts c
        LEFT JOIN profiles e ON c.employer_id = e.id
        LEFT JOIN profiles f ON c.freelancer_id = f.id
        LEFT JOIN jobs j ON c.job_id = j.id
        WHERE c.id = ?
      `)
      .bind(id)
      .first<ContractRow>();

    if (contract) {
      const milestonesResult = await d1
        .prepare(`
          SELECT id, title, amount, status, due_date, deliverable_url, notes
          FROM contract_milestones
          WHERE contract_id = ?
          ORDER BY due_date ASC
        `)
        .bind(id)
        .all<MilestoneRow>();
      milestones = milestonesResult.results ?? [];

      const messagesResult = await d1
        .prepare(`
          SELECT id, sender_id, content, created_at
          FROM messages
          WHERE contract_id = ?
          ORDER BY created_at ASC
          LIMIT 200
        `)
        .bind(id)
        .all<MessageRow>();
      messages = messagesResult.results ?? [];
    }
  } catch (error) {
    console.error("Failed to fetch contract:", error);
  }

  if (!contract) {
    notFound();
  }

  const jobSummary =
    contract.job_description && contract.job_description.length > 160
      ? `${contract.job_description.slice(0, 160)}...`
      : contract.job_description ?? "No job description provided.";

  const isEmployer = contract.employer_id === auth.profile.id;
  const isFreelancer = contract.freelancer_id === auth.profile.id;
  const role = isEmployer ? "employer" : isFreelancer ? "freelancer" : auth.profile.role === "admin" ? "admin" : null;

  if (!role) {
    notFound();
  }

  const participants = [
    { id: contract.employer_id ?? "", name: contract.employer_name ?? "Employer" },
    { id: contract.freelancer_id ?? "", name: contract.freelancer_name ?? "Freelancer" },
  ];

  return (
    <div className="space-y-6">
      <Card className="space-y-3 border border-card-border/70 bg-card/80 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{contract.job_title ?? "Contract"}</h1>
            <p className="text-sm text-muted">{jobSummary}</p>
          </div>
          <Badge variant="muted">{contract.status}</Badge>
        </div>
        {contract.notes ? <p className="text-sm text-muted">Notes: {contract.notes}</p> : null}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <MilestonesSection contractId={contract.id} milestones={milestones} role={role!} />
        <Card className="border border-card-border/70 bg-card/80 p-4">
          <ContractChat
            contractId={contract.id}
            currentUserId={auth.profile.id}
            participants={participants}
            initialMessages={messages}
          />
        </Card>
      </div>
    </div>
  );
}

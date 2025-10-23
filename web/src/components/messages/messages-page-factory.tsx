import Link from "next/link";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContractChat } from "@/components/contracts/chat";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

type RelatedProfile = Pick<Tables<"profiles">, "id" | "full_name" | "avatar_url">;
type RelatedJob = Pick<Tables<"jobs">, "id" | "title">;

type RawContractRow = Tables<"contracts"> & {
  employer: RelatedProfile | RelatedProfile[] | null;
  freelancer: RelatedProfile | RelatedProfile[] | null;
  jobs: RelatedJob | RelatedJob[] | null;
};

type ContractThread = {
  id: string;
  status: Tables<"contracts">["status"];
  updated_at: string;
  jobTitle: string;
  employer: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  freelancer: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
};

type LatestMessagePreview = {
  content: string;
  created_at: string;
};

type MessageRecord = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

interface PageFactoryOptions {
  role: "freelancer" | "employer";
  basePath: string;
  emptyState: {
    title: string;
    description: string;
    cta?: {
      href: string;
      label: string;
    };
  };
}

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const redirectByRole = {
  freelancer: "/freelancer/dashboard",
  employer: "/employer/dashboard",
  admin: "/admin/dashboard",
} as const;

/**
 * Generates a role-aware messages page that reuses the contract chat experience.
 */
export function createMessagesPage({ role, basePath, emptyState }: PageFactoryOptions) {
  return async function MessagesPage({ searchParams }: PageProps) {
    const auth = await getCurrentUser();

    if (!auth?.profile) {
      redirect("/signin");
    }

    if (auth.profile.role !== role) {
      const fallback = auth.profile.role ? redirectByRole[auth.profile.role] : "/onboarding";
      redirect(fallback ?? "/onboarding");
    }

    const supabase = createSupabaseServerClient();
    const filterKey = role === "freelancer" ? "freelancer_id" : "employer_id";

    const { data: contractRows } = await supabase
      .from("contracts")
      .select(
        `
        id,
        status,
        updated_at,
        employer:profiles!contracts_employer_id_fkey ( id, full_name, avatar_url ),
        freelancer:profiles!contracts_freelancer_id_fkey ( id, full_name, avatar_url ),
        jobs ( id, title )
      `,
      )
      .eq(filterKey, auth.profile.id)
      .order("updated_at", { ascending: false });

    const rawContracts = (contractRows ?? []) as RawContractRow[];
    const viewerId = auth.profile.id;
    const threads: ContractThread[] = rawContracts.map((row) => {
      const employer = Array.isArray(row.employer) ? row.employer[0] : row.employer;
      const freelancer = Array.isArray(row.freelancer) ? row.freelancer[0] : row.freelancer;
      const job = Array.isArray(row.jobs) ? row.jobs[0] : row.jobs;

      return {
        id: row.id,
        status: row.status,
        updated_at: row.updated_at,
        jobTitle: job?.title ?? "Untitled project",
        employer: {
          id: employer?.id ?? (role === "employer" ? viewerId : ""),
          name: employer?.full_name ?? "Employer",
          avatarUrl: employer?.avatar_url ?? null,
        },
        freelancer: {
          id: freelancer?.id ?? (role === "freelancer" ? viewerId : ""),
          name: freelancer?.full_name ?? "Freelancer",
          avatarUrl: freelancer?.avatar_url ?? null,
        },
      };
    });

    const contractIds = threads.map((thread) => thread.id);
    const latestMessageMap = new Map<string, LatestMessagePreview>();

    if (contractIds.length > 0) {
      const { data: latestRows } = await supabase
        .from("messages")
        .select("contract_id, content, created_at")
        .in("contract_id", contractIds)
        .order("created_at", { ascending: false });

      const latestMessages = (latestRows ?? []) as (LatestMessagePreview & { contract_id: string })[];
      for (const row of latestMessages) {
        if (!latestMessageMap.has(row.contract_id)) {
          latestMessageMap.set(row.contract_id, {
            content: row.content,
            created_at: row.created_at,
          });
        }
      }
    }

    const requested = searchParams?.contract;
    const requestedContractId = Array.isArray(requested) ? requested[0] : requested;
    let selectedContract = requestedContractId
      ? threads.find((thread) => thread.id === requestedContractId)
      : undefined;

    if (!selectedContract && requestedContractId) {
      // Invalid contract id requested; leave selection empty to show placeholder.
    }

    if (!selectedContract && threads.length > 0) {
      selectedContract = threads[0];
    }

    const selectedContractId = selectedContract?.id;
    let initialMessages: MessageRecord[] = [];

    if (selectedContractId) {
      const { data: messageRows } = await supabase
        .from("messages")
        .select("id, sender_id, content, created_at")
        .eq("contract_id", selectedContractId)
        .order("created_at", { ascending: true })
        .limit(200);

      initialMessages = (messageRows ?? []) as MessageRecord[];
    }

    const participants = selectedContract
      ? [
          { id: selectedContract.employer.id, name: selectedContract.employer.name },
          { id: selectedContract.freelancer.id, name: selectedContract.freelancer.name },
        ]
      : [];

    const counterpartKey = role === "freelancer" ? "employer" : "freelancer";

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Messages</h1>
          <p className="text-sm text-muted">
            Coordinate milestones, share feedback, and keep your projects on track with real-time chat.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card className="h-fit border border-card-border/70 bg-card/80 p-4">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted">Conversations</h2>
            {threads.length === 0 ? (
              <div className="space-y-3 text-sm text-muted">
                <p>{emptyState.title}</p>
                <p>{emptyState.description}</p>
                {emptyState.cta ? (
                  <Button asChild size="sm" variant="outline">
                    <Link href={emptyState.cta.href}>{emptyState.cta.label}</Link>
                  </Button>
                ) : null}
              </div>
            ) : (
              <div className="space-y-2">
                {threads.map((thread) => {
                  const latest = latestMessageMap.get(thread.id);
                  const counterpart = thread[counterpartKey];
                  const isActive = thread.id === selectedContractId;
                  const preview =
                    latest?.content && latest.content.length > 90
                      ? `${latest.content.slice(0, 90)}...`
                      : latest?.content ?? null;

                  return (
                    <Link
                      key={thread.id}
                      href={{
                        pathname: basePath,
                        query: { contract: thread.id },
                      }}
                      className={cn(
                        "flex gap-3 rounded-[var(--radius-md)] border border-transparent p-3 transition",
                        isActive ? "border-accent/40 bg-accent/10" : "hover:bg-foreground/5",
                      )}
                    >
                      <Avatar size="sm" src={counterpart.avatarUrl} fallback={counterpart.name} aria-hidden="true" />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={cn(
                              "text-sm font-medium",
                              isActive ? "text-foreground" : "text-foreground/80",
                            )}
                          >
                            {counterpart.name}
                          </p>
                          <Badge variant="muted" className="text-[10px] uppercase tracking-wide">
                            {thread.status}
                          </Badge>
                        </div>
                        <p className="truncate text-xs text-muted">{thread.jobTitle}</p>
                        <p className="truncate text-xs text-muted/80">
                          {preview ?? "No messages yet"}
                        </p>
                        {latest?.created_at ? (
                          <p className="text-[11px] text-muted/60">
                            {formatDistanceToNow(new Date(latest.created_at), { addSuffix: true })}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>

          <div className="space-y-4">
            {selectedContract ? (
              <>
                <Card className="border border-card-border/70 bg-card/80 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">{selectedContract.jobTitle}</h2>
                      <p className="text-sm text-muted">
                        Chat with {selectedContract[counterpartKey].name} to keep this contract moving.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="muted">{selectedContract.status}</Badge>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/contracts/${selectedContract.id}`}>Open workspace</Link>
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="border border-card-border/70 bg-card/80 p-4">
                  <ContractChat
                    contractId={selectedContract.id}
                    currentUserId={viewerId}
                    participants={participants}
                    initialMessages={initialMessages}
                  />
                </Card>
              </>
            ) : (
              <Card className="flex h-[480px] items-center justify-center border border-dashed border-card-border/70 bg-card/60 p-8 text-center text-sm text-muted">
                Select a conversation to start chatting.
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  };
}

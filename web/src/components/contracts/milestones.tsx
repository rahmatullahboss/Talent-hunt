"use client";

import { useEffect, useTransition } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { createMilestoneAction, submitMilestoneAction, updateMilestoneStatusAction, type MilestoneActionState } from "@/actions/milestones";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const initialState: MilestoneActionState = { status: "idle" };

export function MilestonesSection({
  contractId,
  milestones,
  role,
}: {
  contractId: string;
  milestones: Array<{
    id: string;
    title: string;
    amount: number;
    status: string;
    due_date: string | null;
    deliverable_url: string | null;
    notes: string | null;
  }>;
  role: "freelancer" | "employer" | "admin";
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Milestones</h2>
        {role === "employer" ? <CreateMilestoneForm contractId={contractId} /> : null}
      </div>

      <div className="grid gap-3">
        {milestones.length === 0 ? (
          <Card className="border-dashed p-4 text-sm text-muted">No milestones yet.</Card>
        ) : (
          milestones.map((milestone) => (
            <Card key={milestone.id} className="space-y-3 border border-card-border/70 bg-card/80 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-foreground">{milestone.title}</p>
                  <p className="text-sm text-muted">৳{Number(milestone.amount ?? 0).toLocaleString()}</p>
                  {milestone.due_date ? <p className="text-xs text-muted">Due {new Date(milestone.due_date).toLocaleDateString()}</p> : null}
                </div>
                <Badge variant="muted">{milestone.status}</Badge>
              </div>
              {milestone.deliverable_url ? (
                <a href={milestone.deliverable_url} target="_blank" rel="noreferrer" className="text-sm text-accent underline">
                  View deliverable
                </a>
              ) : null}
              {milestone.notes ? <p className="text-sm text-muted">Notes: {milestone.notes}</p> : null}
              {role === "freelancer" && milestone.status === "pending" ? (
                <SubmitMilestoneForm contractId={contractId} milestoneId={milestone.id} />
              ) : null}
              {role === "employer" && milestone.status === "in_review" ? (
                <ApproveMilestoneForm contractId={contractId} milestoneId={milestone.id} />
              ) : null}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function CreateMilestoneForm({ contractId }: { contractId: string }) {
  const [state, formAction] = useFormState(createMilestoneAction, initialState);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state.status === "error" && state.message) {
      toast.error(state.message);
    } else if (state.status === "success" && state.message) {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      action={(formData) => {
        startTransition(() => formAction(formData));
      }}
    >
      <input type="hidden" name="contractId" value={contractId} />
      <Input name="title" placeholder="Milestone title" required className="w-40" />
      <Input name="amount" type="number" min={0} step="10" placeholder="Amount" required className="w-32" />
      <Input name="dueDate" type="date" className="w-36" />
      <Button type="submit" size="sm" loading={isPending}>
        Add
      </Button>
    </form>
  );
}

function SubmitMilestoneForm({ contractId, milestoneId }: { contractId: string; milestoneId: string }) {
  const [state, formAction] = useFormState(submitMilestoneAction, initialState);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state.status === "error" && state.message) {
      toast.error(state.message);
    } else if (state.status === "success" && state.message) {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <form
      className="space-y-2"
      action={(formData) => {
        startTransition(() => formAction(formData));
      }}
    >
      <input type="hidden" name="contractId" value={contractId} />
      <input type="hidden" name="milestoneId" value={milestoneId} />
      <Input name="deliverableUrl" placeholder="Deliverable URL" />
      <Textarea name="notes" rows={2} placeholder="Notes for the employer" />
      <Button type="submit" size="sm" loading={isPending}>
        Submit for review
      </Button>
    </form>
  );
}

function ApproveMilestoneForm({ contractId, milestoneId }: { contractId: string; milestoneId: string }) {
  const [state, formAction] = useFormState(updateMilestoneStatusAction, initialState);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state.status === "error" && state.message) {
      toast.error(state.message);
    } else if (state.status === "success" && state.message) {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <form
      className="flex items-center gap-2"
      action={(formData) => {
        startTransition(() => formAction(formData));
      }}
    >
      <input type="hidden" name="contractId" value={contractId} />
      <input type="hidden" name="milestoneId" value={milestoneId} />
      <Button type="submit" size="sm" name="status" value="approved" variant="ghost" loading={isPending}>
        Approve
      </Button>
      <Button type="submit" size="sm" name="status" value="rejected" variant="ghost" loading={isPending}>
        Request changes
      </Button>
    </form>
  );
}

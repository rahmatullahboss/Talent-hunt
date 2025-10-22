"use client";

import { useEffect, useTransition } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { hireProposalAction, type JobActionState } from "@/actions/jobs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const initialState: JobActionState = { status: "idle" };

export function HireProposalForm({ jobId, proposalId, defaultAmount }: { jobId: string; proposalId: string; defaultAmount: number }) {
  const [state, formAction] = useFormState(hireProposalAction, initialState);
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
      className="grid gap-2 md:grid-cols-[0.6fr_1fr_auto] md:items-center"
      action={(formData) => {
        startTransition(() => formAction(formData));
      }}
    >
      <input type="hidden" name="jobId" value={jobId} />
      <input type="hidden" name="proposalId" value={proposalId} />
      <Input
        name="escrowAmount"
        type="number"
        min={0}
        step="10"
        defaultValue={defaultAmount}
        placeholder="Escrow amount"
      />
      <Textarea name="notes" rows={2} placeholder="Notes for the freelancer (optional)" />
      <Button type="submit" size="sm" loading={isPending}>
        Hire
      </Button>
    </form>
  );
}

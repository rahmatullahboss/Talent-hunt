"use client";

import { useEffect, useTransition } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { withdrawProposalAction, type ProposalActionState } from "@/actions/proposals";
import { Button } from "@/components/ui/button";

const initialState: ProposalActionState = { status: "idle" };

export function WithdrawProposalButton({ proposalId, disabled }: { proposalId: string; disabled?: boolean }) {
  const [state, formAction] = useFormState(withdrawProposalAction, initialState);
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
      action={(formData) => {
        startTransition(() => formAction(formData));
      }}
    >
      <input type="hidden" name="proposalId" value={proposalId} />
      <Button type="submit" variant="ghost" size="sm" loading={isPending} disabled={disabled || isPending}>
        Withdraw
      </Button>
    </form>
  );
}

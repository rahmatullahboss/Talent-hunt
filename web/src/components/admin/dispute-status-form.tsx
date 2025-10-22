"use client";

import { useEffect, useTransition } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { updateDisputeAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const initialState = { status: "idle" as const, message: undefined as string | undefined };

export function DisputeStatusForm({ disputeId, currentStatus, resolution }: { disputeId: string; currentStatus: string; resolution: string | null }) {
  const [state, formAction] = useFormState(updateDisputeAction, initialState);
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
      <input type="hidden" name="disputeId" value={disputeId} />
      <select name="status" defaultValue={currentStatus} className="h-10 w-full rounded-[var(--radius-md)] border border-card-border bg-card px-3 text-sm">
        <option value="open">Open</option>
        <option value="under_review">Under review</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>
      <Textarea name="resolution" rows={3} placeholder="Resolution notes" defaultValue={resolution ?? ""} />
      <Button type="submit" size="sm" loading={isPending}>
        Update
      </Button>
    </form>
  );
}

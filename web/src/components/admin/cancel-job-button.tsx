"use client";

import { useEffect, useTransition } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { cancelJobAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";

const initialState = { status: "idle" as const, message: undefined as string | undefined };

export function CancelJobButton({ jobId, disabled }: { jobId: string; disabled?: boolean }) {
  const [state, formAction] = useFormState(cancelJobAction, initialState);
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
      <input type="hidden" name="jobId" value={jobId} />
      <Button type="submit" size="sm" variant="ghost" disabled={disabled} loading={isPending}>
        Cancel
      </Button>
    </form>
  );
}

"use client";

import { useEffect, useTransition } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { updateJobStatusAction, type JobActionState } from "@/actions/jobs";
import { Button } from "@/components/ui/button";

const options: Array<{ value: "draft" | "open" | "in_progress" | "completed" | "cancelled"; label: string }> = [
  { value: "draft", label: "Draft" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const initialState: JobActionState = { status: "idle" };

export function JobStatusForm({ jobId, currentStatus }: { jobId: string; currentStatus: string }) {
  const [state, formAction] = useFormState(updateJobStatusAction, initialState);
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
      className="flex items-center gap-3"
      action={(formData) => {
        startTransition(() => formAction(formData));
      }}
    >
      <input type="hidden" name="jobId" value={jobId} />
      <select
        name="status"
        defaultValue={currentStatus}
        className="h-10 rounded-[var(--radius-md)] border border-card-border bg-card px-3 text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Button type="submit" size="sm" loading={isPending}>
        Update
      </Button>
    </form>
  );
}

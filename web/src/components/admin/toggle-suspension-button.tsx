"use client";

import { useEffect, useTransition } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { toggleUserSuspensionAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";

const initialState = { status: "idle" as const, message: undefined as string | undefined };

export function ToggleSuspensionButton({ userId, suspended }: { userId: string; suspended: boolean }) {
  const [state, formAction] = useFormState(toggleUserSuspensionAction, initialState);
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
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="suspend" value={(!suspended).toString()} />
      <Button type="submit" size="sm" variant="ghost" loading={isPending}>
        {suspended ? "Reinstate" : "Suspend"}
      </Button>
    </form>
  );
}

"use client";

import { useEffect, useTransition } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { deletePortfolioItemAction, type ActionState } from "@/actions/portfolio";
import { Button } from "@/components/ui/button";

const initialState: ActionState = { status: "idle" };

export function DeletePortfolioButton({ itemId }: { itemId: string }) {
  const [state, formAction] = useFormState(deletePortfolioItemAction, initialState);
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
      <input type="hidden" name="itemId" value={itemId} />
      <Button type="submit" variant="ghost" size="sm" loading={isPending}>
        Remove
      </Button>
    </form>
  );
}

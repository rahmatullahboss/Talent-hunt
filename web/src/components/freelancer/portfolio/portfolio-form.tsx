"use client";

import { useEffect, useTransition } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { createPortfolioItemAction, type ActionState } from "@/actions/portfolio";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const initialState: ActionState = { status: "idle" };

export function PortfolioForm() {
  const [state, formAction] = useFormState(createPortfolioItemAction, initialState);
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
      className="space-y-4"
      action={(formData) => {
        startTransition(() => formAction(formData));
      }}
    >
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted" htmlFor="title">
          Project title
        </label>
        <Input id="title" name="title" placeholder="Modern fintech dashboard redesign" required />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted" htmlFor="description">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          rows={5}
          placeholder="Summarize the challenge, your approach, and measurable impact."
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted" htmlFor="externalLink">
            External link (optional)
          </label>
          <Input id="externalLink" name="externalLink" placeholder="https://dribbble.com/yourwork" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted" htmlFor="imageUrl">
            Image URL (optional)
          </label>
          <Input id="imageUrl" name="imageUrl" placeholder="https://cdn.example.com/shot.png" />
        </div>
      </div>

      <Button type="submit" loading={isPending}>
        Add to portfolio
      </Button>
    </form>
  );
}

"use client";

import { useEffect, useTransition, useState, useCallback } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { submitProposalAction, type ProposalActionState } from "@/actions/proposals";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AIGenerateButton } from "@/components/ai/ai-generate-button";

const initialState: ProposalActionState = { status: "idle" };

interface ProposalFormProps {
  jobId: string;
  jobTitle?: string;
  jobDescription?: string;
}

export function ProposalForm({ jobId, jobTitle, jobDescription }: ProposalFormProps) {
  const [state, formAction] = useFormState(submitProposalAction, initialState);
  const [isPending, startTransition] = useTransition();
  
  // Controlled state for AI generation
  const [coverLetter, setCoverLetter] = useState("");

  // AI context for proposal/cover letter generation
  const aiContext = `Job title: ${jobTitle || "Not specified"}\nJob description: ${jobDescription || "Not provided"}\n\nWrite a compelling cover letter for this job application.`;

  // Handle AI generated cover letter
  const handleAICoverLetter = useCallback((text: string) => {
    setCoverLetter(text);
  }, []);

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
        startTransition(() => {
          formAction(formData);
        });
      }}
      className="space-y-5"
    >
      <input type="hidden" name="jobId" value={jobId} />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted" htmlFor="bidAmount">
            Bid amount
          </label>
          <Input id="bidAmount" name="bidAmount" type="number" min={0} step="0.01" placeholder="500" required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted" htmlFor="bidType">
            Bid type
          </label>
          <select
            id="bidType"
            name="bidType"
            className="h-11 w-full rounded-[var(--radius-md)] border border-card-border bg-card px-4 text-sm text-foreground"
            defaultValue="fixed"
          >
            <option value="fixed">Fixed price</option>
            <option value="hourly">Hourly</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted" htmlFor="estimatedHours">
            Estimated hours (if hourly)
          </label>
          <Input id="estimatedHours" name="estimatedHours" type="number" min={1} placeholder="10" />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted" htmlFor="coverLetter">
            Cover letter
          </label>
          <AIGenerateButton
            contentType="proposal"
            context={aiContext}
            onGenerate={handleAICoverLetter}
            disabled={!jobTitle}
          />
        </div>
        <Textarea
          id="coverLetter"
          name="coverLetter"
          rows={8}
          required
          placeholder="Explain how you will approach the project, relevant experience, and availability."
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
        />
        <p className="text-xs text-muted">Minimum 50 characters. Highlight relevant outcomes and similar work.</p>
      </div>

      <Button type="submit" loading={isPending}>
        Submit proposal
      </Button>
    </form>
  );
}

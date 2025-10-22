'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";

const schema = z.object({
  jobId: z.string().uuid(),
  coverLetter: z.string().min(50, "Cover letter should be at least 50 characters to show your expertise."),
  bidAmount: z.coerce.number().positive("Bid amount must be greater than zero."),
  bidType: z.enum(["fixed", "hourly"]),
  estimatedHours: z
    .preprocess((value) => (value === "" || value === null ? undefined : Number(value)), z.number().positive().max(1000).optional()),
});

const withdrawSchema = z.object({
  proposalId: z.string().uuid(),
});

export type ProposalActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitProposalAction(_: ProposalActionState, formData: FormData): Promise<ProposalActionState> {
  const parsed = schema.safeParse({
    jobId: formData.get("jobId"),
    coverLetter: formData.get("coverLetter"),
    bidAmount: formData.get("bidAmount"),
    bidType: formData.get("bidType"),
    estimatedHours: formData.get("estimatedHours"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid proposal data.";
    return { status: "error", message: firstError };
  }

  const auth = await getCurrentUser();
  if (!auth?.profile || auth.profile.role !== "freelancer") {
    return { status: "error", message: "Only freelancers can submit proposals." };
  }

  const supabase = createSupabaseServerClient();

  const { data: existingProposal } = await supabase
    .from("proposals")
    .select("id")
    .eq("job_id", parsed.data.jobId)
    .eq("freelancer_id", auth.profile.id)
    .maybeSingle();

  if (existingProposal) {
    return { status: "error", message: "You have already submitted a proposal for this job." };
  }

  const { error } = await supabase.from("proposals").insert({
    job_id: parsed.data.jobId,
    freelancer_id: auth.profile.id,
    cover_letter: parsed.data.coverLetter,
    bid_amount: parsed.data.bidAmount,
    bid_type: parsed.data.bidType,
    estimated_hours: parsed.data.bidType === "hourly" ? parsed.data.estimatedHours ?? null : null,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath(`/freelancer/jobs/${parsed.data.jobId}`);
  revalidatePath("/freelancer/proposals");
  revalidatePath("/freelancer/dashboard");

  return { status: "success", message: "Proposal submitted successfully!" };
}

export async function withdrawProposalAction(_: ProposalActionState, formData: FormData): Promise<ProposalActionState> {
  const parsed = withdrawSchema.safeParse({
    proposalId: formData.get("proposalId"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Invalid proposal reference." };
  }

  const auth = await getCurrentUser();
  if (!auth?.profile || auth.profile.role !== "freelancer") {
    return { status: "error", message: "Only freelancers can withdraw proposals." };
  }

  const supabase = createSupabaseServerClient();

  const { data: proposal, error: fetchError } = await supabase
    .from("proposals")
    .select("id, job_id, freelancer_id, status")
    .eq("id", parsed.data.proposalId)
    .maybeSingle();

  if (fetchError || !proposal || proposal.freelancer_id !== auth.profile.id) {
    return { status: "error", message: "Proposal not found." };
  }

  if (proposal.status !== "submitted" && proposal.status !== "shortlisted") {
    return { status: "error", message: "Only pending proposals can be withdrawn." };
  }

  const { error } = await supabase
    .from("proposals")
    .update({ status: "withdrawn" })
    .eq("id", proposal.id);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath(`/freelancer/jobs/${proposal.job_id}`);
  revalidatePath("/freelancer/proposals");

  return { status: "success", message: "Proposal withdrawn." };
}


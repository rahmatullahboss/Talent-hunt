'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser, getDB } from "@/lib/auth/session";
import { generateId } from "@/lib/db";

const schema = z.object({
  jobId: z.string(),
  coverLetter: z.string().min(50, "Cover letter should be at least 50 characters to show your expertise."),
  bidAmount: z.coerce.number().positive("Bid amount must be greater than zero."),
  bidType: z.enum(["fixed", "hourly"]),
  estimatedHours: z
    .preprocess((value) => (value === "" || value === null ? undefined : Number(value)), z.number().positive().max(1000).optional()),
});

const withdrawSchema = z.object({
  proposalId: z.string(),
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
  if (!auth?.profile || (auth.profile as { role: string }).role !== "freelancer") {
    return { status: "error", message: "Only freelancers can submit proposals." };
  }

  const db = getDB();
  if (!db) {
    return { status: "error", message: "Database not available." };
  }

  try {
    // Check for existing proposal
    const existingProposal = await db
      .prepare("SELECT id FROM proposals WHERE job_id = ? AND freelancer_id = ?")
      .bind(parsed.data.jobId, (auth.profile as { id: string }).id)
      .first();

    if (existingProposal) {
      return { status: "error", message: "You have already submitted a proposal for this job." };
    }

    // Insert new proposal
    const proposalId = generateId();
    await db
      .prepare(
        `INSERT INTO proposals (id, job_id, freelancer_id, cover_letter, bid_amount, bid_type, estimated_hours, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'submitted')`
      )
      .bind(
        proposalId,
        parsed.data.jobId,
        (auth.profile as { id: string }).id,
        parsed.data.coverLetter,
        parsed.data.bidAmount,
        parsed.data.bidType,
        parsed.data.bidType === "hourly" ? (parsed.data.estimatedHours ?? null) : null
      )
      .run();

    revalidatePath(`/freelancer/jobs/${parsed.data.jobId}`);
    revalidatePath("/freelancer/proposals");
    revalidatePath("/freelancer/dashboard");

    return { status: "success", message: "Proposal submitted successfully!" };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Failed to submit proposal." };
  }
}

interface Proposal {
  id: string;
  job_id: string;
  freelancer_id: string;
  status: string;
}

export async function withdrawProposalAction(_: ProposalActionState, formData: FormData): Promise<ProposalActionState> {
  const parsed = withdrawSchema.safeParse({
    proposalId: formData.get("proposalId"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Invalid proposal reference." };
  }

  const auth = await getCurrentUser();
  if (!auth?.profile || (auth.profile as { role: string }).role !== "freelancer") {
    return { status: "error", message: "Only freelancers can withdraw proposals." };
  }

  const db = getDB();
  if (!db) {
    return { status: "error", message: "Database not available." };
  }

  try {
    // Get proposal
    const proposal = await db
      .prepare("SELECT id, job_id, freelancer_id, status FROM proposals WHERE id = ?")
      .bind(parsed.data.proposalId)
      .first<Proposal>();

    if (!proposal || proposal.freelancer_id !== (auth.profile as { id: string }).id) {
      return { status: "error", message: "Proposal not found." };
    }

    if (proposal.status !== "submitted" && proposal.status !== "shortlisted") {
      return { status: "error", message: "Only pending proposals can be withdrawn." };
    }

    // Update proposal status
    await db
      .prepare("UPDATE proposals SET status = 'withdrawn', updated_at = datetime('now') WHERE id = ?")
      .bind(proposal.id)
      .run();

    revalidatePath(`/freelancer/jobs/${proposal.job_id}`);
    revalidatePath("/freelancer/proposals");

    return { status: "success", message: "Proposal withdrawn." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Failed to withdraw proposal." };
  }
}

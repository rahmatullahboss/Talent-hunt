'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { getDB } from "@/lib/auth/session";
import { generateId, toJsonArray } from "@/lib/db";

const jobSchema = z.object({
  title: z.string().min(5, "Provide a descriptive job title."),
  description: z.string().min(50, "Share enough detail about the project (min 50 characters)."),
  category: z.string().min(2, "Select a category."),
  budgetMode: z.enum(["fixed", "hourly"]),
  budgetMin: z.coerce.number().min(0, "Budget must be positive."),
  budgetMax: z.coerce.number().optional(),
  skills: z
    .string()
    .transform((value) =>
      value
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.string()).min(1, "Add at least one required skill.")),
  experience: z.enum(["entry", "mid", "expert"]),
  deadline: z
    .string()
    .optional()
    .transform((value) => (value?.length ? value : undefined)),
});

const statusSchema = z.object({
  jobId: z.string(),
  status: z.enum(["draft", "open", "in_progress", "completed", "cancelled"]),
});

const hireSchema = z.object({
  proposalId: z.string(),
  jobId: z.string(),
  escrowAmount: z.coerce.number().optional(),
  notes: z.string().optional(),
});

export type JobActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function createJobAction(_: JobActionState, formData: FormData): Promise<JobActionState> {
  const parsed = jobSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    budgetMode: formData.get("budgetMode"),
    budgetMin: formData.get("budgetMin"),
    budgetMax: formData.get("budgetMax"),
    skills: formData.get("skills"),
    experience: formData.get("experience"),
    deadline: formData.get("deadline"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid job post.";
    return { status: "error", message: firstError };
  }

  const auth = await getCurrentUser();
  if (!auth?.profile || (auth.profile as { role: string }).role !== "employer") {
    return { status: "error", message: "Only employers can post jobs." };
  }

  const db = getDB();
  if (!db) {
    return { status: "error", message: "Database not available." };
  }

  try {
    const jobId = generateId();
    await db
      .prepare(
        `INSERT INTO jobs (id, employer_id, title, description, category, budget_mode, budget_min, budget_max, skills, experience_level, deadline, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')`
      )
      .bind(
        jobId,
        auth.profile.id,
        parsed.data.title,
        parsed.data.description,
        parsed.data.category,
        parsed.data.budgetMode,
        parsed.data.budgetMin,
        parsed.data.budgetMax ?? null,
        toJsonArray(parsed.data.skills),
        parsed.data.experience,
        parsed.data.deadline ?? null
      )
      .run();

    revalidatePath("/employer/jobs");
    revalidatePath("/employer/dashboard");

    return { status: "success", message: "Job posted successfully." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Failed to create job." };
  }
}

export async function updateJobStatusAction(_: JobActionState, formData: FormData): Promise<JobActionState> {
  const parsed = statusSchema.safeParse({
    jobId: formData.get("jobId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Invalid job status update." };
  }

  const auth = await getCurrentUser();
  if (!auth?.profile || (auth.profile as { role: string }).role !== "employer") {
    return { status: "error", message: "Only employers can update job status." };
  }

  const db = getDB();
  if (!db) {
    return { status: "error", message: "Database not available." };
  }

  try {
    await db
      .prepare(
        `UPDATE jobs SET status = ?, updated_at = datetime('now') WHERE id = ? AND employer_id = ?`
      )
      .bind(parsed.data.status, parsed.data.jobId, auth.profile.id)
      .run();

    revalidatePath(`/employer/jobs/${parsed.data.jobId}`);
    revalidatePath("/employer/jobs");
    revalidatePath("/freelancer/jobs");

    return { status: "success", message: "Job updated." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Failed to update job." };
  }
}

interface Proposal {
  id: string;
  freelancer_id: string;
  job_id: string;
  status: string;
  bid_amount: number;
  bid_type: string;
}

interface Job {
  id: string;
  employer_id: string;
  status: string;
}

export async function hireProposalAction(_: JobActionState, formData: FormData): Promise<JobActionState> {
  const parsed = hireSchema.safeParse({
    proposalId: formData.get("proposalId"),
    jobId: formData.get("jobId"),
    escrowAmount: formData.get("escrowAmount"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Invalid hire request." };
  }

  const auth = await getCurrentUser();
  if (!auth?.profile || (auth.profile as { role: string }).role !== "employer") {
    return { status: "error", message: "Only employers can hire freelancers." };
  }

  const db = getDB();
  if (!db) {
    return { status: "error", message: "Database not available." };
  }

  try {
    // Get proposal
    const proposal = await db
      .prepare("SELECT id, freelancer_id, job_id, status, bid_amount, bid_type FROM proposals WHERE id = ?")
      .bind(parsed.data.proposalId)
      .first<Proposal>();

    if (!proposal || proposal.job_id !== parsed.data.jobId) {
      return { status: "error", message: "Proposal not found." };
    }

    if (proposal.status === "hired") {
      return { status: "error", message: "Proposal is already marked as hired." };
    }

    // Get job
    const job = await db
      .prepare("SELECT id, employer_id, status FROM jobs WHERE id = ?")
      .bind(parsed.data.jobId)
      .first<Job>();

    if (!job || job.employer_id !== auth.profile.id) {
      return { status: "error", message: "You do not have access to this job." };
    }

    // Create contract
    const contractId = generateId();
    await db
      .prepare(
        `INSERT INTO contracts (id, proposal_id, job_id, employer_id, freelancer_id, status, escrow_amount, notes)
         VALUES (?, ?, ?, ?, ?, 'active', ?, ?)`
      )
      .bind(
        contractId,
        proposal.id,
        job.id,
        auth.profile.id,
        proposal.freelancer_id,
        parsed.data.escrowAmount ?? proposal.bid_amount,
        parsed.data.notes ?? null
      )
      .run();

    // Update proposal status
    await db
      .prepare("UPDATE proposals SET status = 'hired', updated_at = datetime('now') WHERE id = ?")
      .bind(proposal.id)
      .run();

    // Update job status
    await db
      .prepare("UPDATE jobs SET status = 'in_progress', updated_at = datetime('now') WHERE id = ?")
      .bind(job.id)
      .run();

    revalidatePath(`/employer/jobs/${job.id}`);
    revalidatePath("/employer/contracts");
    revalidatePath("/freelancer/dashboard");

    return { status: "success", message: "Freelancer hired successfully. Contract created." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Failed to hire freelancer." };
  }
}

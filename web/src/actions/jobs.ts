'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";

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
  jobId: z.string().uuid(),
  status: z.enum(["draft", "open", "in_progress", "completed", "cancelled"]),
});

const hireSchema = z.object({
  proposalId: z.string().uuid(),
  jobId: z.string().uuid(),
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
  if (!auth?.profile || auth.profile.role !== "employer") {
    return { status: "error", message: "Only employers can post jobs." };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("jobs").insert({
    employer_id: auth.profile.id,
    title: parsed.data.title,
    description: parsed.data.description,
    category: parsed.data.category,
    budget_mode: parsed.data.budgetMode,
    budget_min: parsed.data.budgetMin,
    budget_max: parsed.data.budgetMax ?? null,
    skills: parsed.data.skills,
    experience_level: parsed.data.experience,
    deadline: parsed.data.deadline ?? null,
    status: "open",
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/employer/jobs");
  revalidatePath("/employer/dashboard");

  return { status: "success", message: "Job posted successfully." };
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
  if (!auth?.profile || auth.profile.role !== "employer") {
    return { status: "error", message: "Only employers can update job status." };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("jobs")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.jobId)
    .eq("employer_id", auth.profile.id);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath(`/employer/jobs/${parsed.data.jobId}`);
  revalidatePath("/employer/jobs");
  revalidatePath("/freelancer/jobs");

  return { status: "success", message: "Job updated." };
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
  if (!auth?.profile || auth.profile.role !== "employer") {
    return { status: "error", message: "Only employers can hire freelancers." };
  }

  const supabase = createSupabaseServerClient();

  const { data: proposal, error: proposalError } = await supabase
    .from("proposals")
    .select("id, freelancer_id, job_id, status, bid_amount, bid_type")
    .eq("id", parsed.data.proposalId)
    .maybeSingle();

  if (proposalError || !proposal || proposal.job_id !== parsed.data.jobId) {
    return { status: "error", message: "Proposal not found." };
  }

  if (proposal.status === "hired") {
    return { status: "error", message: "Proposal is already marked as hired." };
  }

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("id, employer_id, status")
    .eq("id", parsed.data.jobId)
    .maybeSingle();

  if (jobError || !job || job.employer_id !== auth.profile.id) {
    return { status: "error", message: "You do not have access to this job." };
  }

  const { error: contractError } = await supabase.from("contracts").insert({
    proposal_id: proposal.id,
    job_id: job.id,
    employer_id: auth.profile.id,
    freelancer_id: proposal.freelancer_id,
    status: "active",
    escrow_amount: parsed.data.escrowAmount ?? proposal.bid_amount,
    notes: parsed.data.notes ?? null,
  });

  if (contractError) {
    return { status: "error", message: contractError.message };
  }

  await supabase.from("proposals").update({ status: "hired" }).eq("id", proposal.id);
  await supabase.from("jobs").update({ status: "in_progress" }).eq("id", job.id);

  revalidatePath(`/employer/jobs/${job.id}`);
  revalidatePath("/employer/contracts");
  revalidatePath("/freelancer/dashboard");

  return { status: "success", message: "Freelancer hired successfully. Contract created." };
}

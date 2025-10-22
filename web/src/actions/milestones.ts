'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";

const createSchema = z.object({
  contractId: z.string().uuid(),
  title: z.string().min(3, "Add a descriptive milestone title."),
  amount: z.coerce.number().positive(),
  dueDate: z
    .string()
    .optional()
    .transform((value) => (value?.length ? value : undefined)),
});

const submitSchema = z.object({
  milestoneId: z.string().uuid(),
  contractId: z.string().uuid(),
  deliverableUrl: z
    .string()
    .optional()
    .transform((value) => (value?.length ? value : undefined)),
  notes: z.string().optional(),
});

const statusSchema = z.object({
  milestoneId: z.string().uuid(),
  contractId: z.string().uuid(),
  status: z.enum(["approved", "rejected"]),
});

type MilestoneActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function createMilestoneAction(_: MilestoneActionState, formData: FormData): Promise<MilestoneActionState> {
  const parsed = createSchema.safeParse({
    contractId: formData.get("contractId"),
    title: formData.get("title"),
    amount: formData.get("amount"),
    dueDate: formData.get("dueDate"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid milestone.";
    return { status: "error", message: firstError };
  }

  const auth = await getCurrentUser();
  if (!auth?.profile || auth.profile.role !== "employer") {
    return { status: "error", message: "Only employers can create milestones." };
  }

  const supabase = createSupabaseServerClient();

  const { data: contract } = await supabase
    .from("contracts")
    .select("id, employer_id")
    .eq("id", parsed.data.contractId)
    .maybeSingle();

  if (!contract || contract.employer_id !== auth.profile.id) {
    return { status: "error", message: "You do not have permission to modify this contract." };
  }

  const { error } = await supabase.from("contract_milestones").insert({
    contract_id: parsed.data.contractId,
    title: parsed.data.title,
    amount: parsed.data.amount,
    due_date: parsed.data.dueDate ?? null,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath(`/contracts/${parsed.data.contractId}`);

  return { status: "success", message: "Milestone added." };
}

export async function submitMilestoneAction(_: MilestoneActionState, formData: FormData): Promise<MilestoneActionState> {
  const parsed = submitSchema.safeParse({
    milestoneId: formData.get("milestoneId"),
    contractId: formData.get("contractId"),
    deliverableUrl: formData.get("deliverableUrl"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Invalid submission." };
  }

  const auth = await getCurrentUser();
  if (!auth?.profile || auth.profile.role !== "freelancer") {
    return { status: "error", message: "Only freelancers can submit milestones." };
  }

  const supabase = createSupabaseServerClient();
  const { data: milestone } = await supabase
    .from("contract_milestones")
    .select("id, contract_id")
    .eq("id", parsed.data.milestoneId)
    .maybeSingle();

  if (!milestone) {
    return { status: "error", message: "Milestone not found." };
  }

  const { data: contract } = await supabase
    .from("contracts")
    .select("id, freelancer_id")
    .eq("id", milestone.contract_id)
    .maybeSingle();

  if (!contract || contract.freelancer_id !== auth.profile.id) {
    return { status: "error", message: "You do not have permission to update this milestone." };
  }

  const { error } = await supabase
    .from("contract_milestones")
    .update({
      status: "in_review",
      deliverable_url: parsed.data.deliverableUrl ?? null,
      notes: parsed.data.notes ?? null,
    })
    .eq("id", parsed.data.milestoneId);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath(`/contracts/${parsed.data.contractId}`);

  return { status: "success", message: "Milestone submitted for review." };
}

export async function updateMilestoneStatusAction(_: MilestoneActionState, formData: FormData): Promise<MilestoneActionState> {
  const parsed = statusSchema.safeParse({
    milestoneId: formData.get("milestoneId"),
    contractId: formData.get("contractId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Invalid status update." };
  }

  const auth = await getCurrentUser();
  if (!auth?.profile || auth.profile.role !== "employer") {
    return { status: "error", message: "Only employers can approve milestones." };
  }

  const supabase = createSupabaseServerClient();
  const { data: milestone } = await supabase
    .from("contract_milestones")
    .select("id, contract_id, amount")
    .eq("id", parsed.data.milestoneId)
    .maybeSingle();

  if (!milestone) {
    return { status: "error", message: "Milestone not found." };
  }

  const { data: contract } = await supabase
    .from("contracts")
    .select("id, employer_id, freelancer_id")
    .eq("id", milestone.contract_id)
    .maybeSingle();

  if (!contract || contract.employer_id !== auth.profile.id) {
    return { status: "error", message: "You do not have permission to update this milestone." };
  }

  const { error } = await supabase
    .from("contract_milestones")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.milestoneId);

  if (error) {
    return { status: "error", message: error.message };
  }

  if (parsed.data.status === "approved") {
    await supabase.from("wallet_transactions").insert({
      user_id: contract.freelancer_id,
      type: "release",
      amount: milestone.amount ?? 0,
      status: "pending",
      reference: `milestone:${parsed.data.milestoneId}`,
    });
  }

  revalidatePath(`/contracts/${parsed.data.contractId}`);

  return { status: "success", message: "Milestone updated." };
}

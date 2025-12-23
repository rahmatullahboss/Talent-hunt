'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser, getDB } from "@/lib/auth/session";
import { generateId } from "@/lib/db";

const createSchema = z.object({
  contractId: z.string(),
  title: z.string().min(3, "Add a descriptive milestone title."),
  amount: z.coerce.number().positive(),
  dueDate: z
    .string()
    .optional()
    .transform((value) => (value?.length ? value : undefined)),
});

const submitSchema = z.object({
  milestoneId: z.string(),
  contractId: z.string(),
  deliverableUrl: z
    .string()
    .optional()
    .transform((value) => (value?.length ? value : undefined)),
  notes: z.string().optional(),
});

const statusSchema = z.object({
  milestoneId: z.string(),
  contractId: z.string(),
  status: z.enum(["approved", "rejected"]),
});

export type MilestoneActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

interface Contract {
  id: string;
  employer_id: string;
  freelancer_id: string;
}

interface Milestone {
  id: string;
  contract_id: string;
  amount: number;
}

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
  if (!auth?.profile || (auth.profile as { role: string }).role !== "employer") {
    return { status: "error", message: "Only employers can create milestones." };
  }

  const db = getDB();
  if (!db) {
    return { status: "error", message: "Database not available." };
  }

  try {
    const contract = await db
      .prepare("SELECT id, employer_id FROM contracts WHERE id = ?")
      .bind(parsed.data.contractId)
      .first<Contract>();

    if (!contract || contract.employer_id !== auth.profile.id) {
      return { status: "error", message: "You do not have permission to modify this contract." };
    }

    const milestoneId = generateId();
    await db
      .prepare(
        `INSERT INTO contract_milestones (id, contract_id, title, amount, due_date, status)
         VALUES (?, ?, ?, ?, ?, 'pending')`
      )
      .bind(milestoneId, parsed.data.contractId, parsed.data.title, parsed.data.amount, parsed.data.dueDate ?? null)
      .run();

    revalidatePath(`/contracts/${parsed.data.contractId}`);
    return { status: "success", message: "Milestone added." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Failed to create milestone." };
  }
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
  if (!auth?.profile || (auth.profile as { role: string }).role !== "freelancer") {
    return { status: "error", message: "Only freelancers can submit milestones." };
  }

  const db = getDB();
  if (!db) {
    return { status: "error", message: "Database not available." };
  }

  try {
    const milestone = await db
      .prepare("SELECT id, contract_id FROM contract_milestones WHERE id = ?")
      .bind(parsed.data.milestoneId)
      .first<Milestone>();

    if (!milestone) {
      return { status: "error", message: "Milestone not found." };
    }

    const contract = await db
      .prepare("SELECT id, freelancer_id FROM contracts WHERE id = ?")
      .bind(milestone.contract_id)
      .first<Contract>();

    if (!contract || contract.freelancer_id !== auth.profile.id) {
      return { status: "error", message: "You do not have permission to update this milestone." };
    }

    await db
      .prepare(
        `UPDATE contract_milestones SET status = 'in_review', deliverable_url = ?, notes = ?, updated_at = datetime('now') WHERE id = ?`
      )
      .bind(parsed.data.deliverableUrl ?? null, parsed.data.notes ?? null, parsed.data.milestoneId)
      .run();

    revalidatePath(`/contracts/${parsed.data.contractId}`);
    return { status: "success", message: "Milestone submitted for review." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Failed to submit milestone." };
  }
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
  if (!auth?.profile || (auth.profile as { role: string }).role !== "employer") {
    return { status: "error", message: "Only employers can approve milestones." };
  }

  const db = getDB();
  if (!db) {
    return { status: "error", message: "Database not available." };
  }

  try {
    const milestone = await db
      .prepare("SELECT id, contract_id, amount FROM contract_milestones WHERE id = ?")
      .bind(parsed.data.milestoneId)
      .first<Milestone>();

    if (!milestone) {
      return { status: "error", message: "Milestone not found." };
    }

    const contract = await db
      .prepare("SELECT id, employer_id, freelancer_id FROM contracts WHERE id = ?")
      .bind(milestone.contract_id)
      .first<Contract>();

    if (!contract || contract.employer_id !== auth.profile.id) {
      return { status: "error", message: "You do not have permission to update this milestone." };
    }

    await db
      .prepare("UPDATE contract_milestones SET status = ?, updated_at = datetime('now') WHERE id = ?")
      .bind(parsed.data.status, parsed.data.milestoneId)
      .run();

    // Create wallet transaction if approved
    if (parsed.data.status === "approved") {
      const txId = generateId();
      await db
        .prepare(
          `INSERT INTO wallet_transactions (id, user_id, type, amount, status, reference)
           VALUES (?, ?, 'release', ?, 'pending', ?)`
        )
        .bind(txId, contract.freelancer_id, milestone.amount ?? 0, `milestone:${parsed.data.milestoneId}`)
        .run();
    }

    revalidatePath(`/contracts/${parsed.data.contractId}`);
    return { status: "success", message: "Milestone updated." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Failed to update milestone." };
  }
}

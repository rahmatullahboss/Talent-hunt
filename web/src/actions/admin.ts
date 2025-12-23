'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser, getDB, type Profile } from "@/lib/auth/session";
import { generateId } from "@/lib/db";

const toggleSchema = z.object({
  userId: z.string(),
  suspend: z.coerce.boolean(),
});

const settingsSchema = z.object({
  commission: z.coerce.number().min(0).max(100),
  bankAccountName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankName: z.string().optional(),
  walletProvider: z.string().optional(),
  walletNumber: z.string().optional(),
});

const disputeSchema = z.object({
  disputeId: z.string(),
  status: z.enum(["open", "under_review", "resolved", "closed"]),
  resolution: z.string().optional(),
});

const jobSchema = z.object({
  jobId: z.string(),
});

export type AdminActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

async function ensureAdmin() {
  const auth = await getCurrentUser();
  if (!auth?.profile || (auth.profile as Profile).role !== "admin") {
    throw new Error("Admin access required");
  }

  const db = getDB();
  if (!db) {
    throw new Error("Database not available");
  }

  return { auth, db };
}

export async function toggleUserSuspensionAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    const { auth, db } = await ensureAdmin();
    const parsed = toggleSchema.parse({
      userId: formData.get("userId"),
      suspend: formData.get("suspend") === "true",
    });

    if (parsed.userId === (auth.profile as { id: string })?.id) {
      return { status: "error", message: "You cannot suspend your own admin account." };
    }

    await db
      .prepare("UPDATE profiles SET is_suspended = ?, updated_at = datetime('now') WHERE id = ?")
      .bind(parsed.suspend ? 1 : 0, parsed.userId)
      .run();

    revalidatePath("/admin/users");
    return { status: "success", message: parsed.suspend ? "User suspended." : "User reinstated." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update user";
    return { status: "error", message };
  }
}

export async function updateAdminSettingsAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    const { db } = await ensureAdmin();
    const parsed = settingsSchema.parse({
      commission: formData.get("commission"),
      bankAccountName: formData.get("bankAccountName"),
      bankAccountNumber: formData.get("bankAccountNumber"),
      bankName: formData.get("bankName"),
      walletProvider: formData.get("walletProvider"),
      walletNumber: formData.get("walletNumber"),
    });

    // Check if settings exist
    const existing = await db.prepare("SELECT id FROM admin_settings LIMIT 1").first();

    if (existing) {
      await db
        .prepare(
          `UPDATE admin_settings SET 
           commission_percentage = ?, bank_account_name = ?, bank_account_number = ?, bank_name = ?, 
           mobile_wallet_provider = ?, mobile_wallet_number = ?, updated_at = datetime('now')`
        )
        .bind(
          parsed.commission,
          parsed.bankAccountName ?? null,
          parsed.bankAccountNumber ?? null,
          parsed.bankName ?? null,
          parsed.walletProvider ?? null,
          parsed.walletNumber ?? null
        )
        .run();
    } else {
      const settingsId = generateId();
      await db
        .prepare(
          `INSERT INTO admin_settings (id, commission_percentage, bank_account_name, bank_account_number, bank_name, mobile_wallet_provider, mobile_wallet_number)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          settingsId,
          parsed.commission,
          parsed.bankAccountName ?? null,
          parsed.bankAccountNumber ?? null,
          parsed.bankName ?? null,
          parsed.walletProvider ?? null,
          parsed.walletNumber ?? null
        )
        .run();
    }

    revalidatePath("/admin/settings");
    revalidatePath("/employer/payments");
    revalidatePath("/freelancer/wallet");

    return { status: "success", message: "Settings updated." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update settings";
    return { status: "error", message };
  }
}

export async function updateDisputeAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    const { db } = await ensureAdmin();
    const parsed = disputeSchema.parse({
      disputeId: formData.get("disputeId"),
      status: formData.get("status"),
      resolution: formData.get("resolution"),
    });

    await db
      .prepare("UPDATE disputes SET status = ?, resolution = ?, updated_at = datetime('now') WHERE id = ?")
      .bind(parsed.status, parsed.resolution ?? null, parsed.disputeId)
      .run();

    revalidatePath("/admin/disputes");
    revalidatePath(`/contracts/${parsed.disputeId}`);

    return { status: "success", message: "Dispute updated." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update dispute";
    return { status: "error", message };
  }
}

export async function cancelJobAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    const { db } = await ensureAdmin();
    const parsed = jobSchema.parse({ jobId: formData.get("jobId") });

    await db
      .prepare("UPDATE jobs SET status = 'cancelled', updated_at = datetime('now') WHERE id = ?")
      .bind(parsed.jobId)
      .run();

    revalidatePath("/admin/jobs");
    revalidatePath(`/employer/jobs/${parsed.jobId}`);
    revalidatePath("/freelancer/jobs");

    return { status: "success", message: "Job cancelled." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to cancel job";
    return { status: "error", message };
  }
}

'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";

const toggleSchema = z.object({
  userId: z.string().uuid(),
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
  disputeId: z.string().uuid(),
  status: z.enum(["open", "under_review", "resolved", "closed"]),
  resolution: z.string().optional(),
});

const jobSchema = z.object({
  jobId: z.string().uuid(),
});

type AdminActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

async function ensureAdmin() {
  const auth = await getCurrentUser();
  if (!auth?.profile || auth.profile.role !== "admin") {
    throw new Error("Admin access required");
  }
  return { auth, supabase: createSupabaseServerClient() };
}

export async function toggleUserSuspensionAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    const { auth, supabase } = await ensureAdmin();
    const parsed = toggleSchema.parse({
      userId: formData.get("userId"),
      suspend: formData.get("suspend") === "true",
    });

    if (parsed.userId === auth.profile.id) {
      return { status: "error", message: "You cannot suspend your own admin account." };
    }

    const { error } = await supabase.from("profiles").update({ is_suspended: parsed.suspend }).eq("id", parsed.userId);
    if (error) {
      return { status: "error", message: error.message };
    }

    revalidatePath("/admin/users");
    return { status: "success", message: parsed.suspend ? "User suspended." : "User reinstated." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update user";
    return { status: "error", message };
  }
}

export async function updateAdminSettingsAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    const { supabase } = await ensureAdmin();
    const parsed = settingsSchema.parse({
      commission: formData.get("commission"),
      bankAccountName: formData.get("bankAccountName"),
      bankAccountNumber: formData.get("bankAccountNumber"),
      bankName: formData.get("bankName"),
      walletProvider: formData.get("walletProvider"),
      walletNumber: formData.get("walletNumber"),
    });

    const { error } = await supabase
      .from("admin_settings")
      .upsert({
        commission_percentage: parsed.commission,
        bank_account_name: parsed.bankAccountName ?? null,
        bank_account_number: parsed.bankAccountNumber ?? null,
        bank_name: parsed.bankName ?? null,
        mobile_wallet_provider: parsed.walletProvider ?? null,
        mobile_wallet_number: parsed.walletNumber ?? null,
      });

    if (error) {
      return { status: "error", message: error.message };
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
    const { supabase } = await ensureAdmin();
    const parsed = disputeSchema.parse({
      disputeId: formData.get("disputeId"),
      status: formData.get("status"),
      resolution: formData.get("resolution"),
    });

    const { error } = await supabase
      .from("disputes")
      .update({ status: parsed.status, resolution: parsed.resolution ?? null })
      .eq("id", parsed.disputeId);

    if (error) {
      return { status: "error", message: error.message };
    }

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
    const { supabase } = await ensureAdmin();
    const parsed = jobSchema.parse({ jobId: formData.get("jobId") });

    const { error } = await supabase.from("jobs").update({ status: "cancelled" }).eq("id", parsed.jobId);
    if (error) {
      return { status: "error", message: error.message };
    }

    revalidatePath("/admin/jobs");
    revalidatePath(`/employer/jobs/${parsed.jobId}`);
    revalidatePath("/freelancer/jobs");

    return { status: "success", message: "Job cancelled." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to cancel job";
    return { status: "error", message };
  }
}

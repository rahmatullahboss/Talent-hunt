'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser, getDB } from "@/lib/auth/session";
import { generateId } from "@/lib/db";

const withdrawalSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than zero."),
  accountName: z.string().min(3, "Enter the account holder name."),
  accountNumber: z.string().min(6, "Enter a valid account number."),
  bankName: z.string().min(3, "Specify the bank name."),
  mobileWalletNumber: z
    .string()
    .optional()
    .transform((value) => (value?.length ? value : undefined)),
});

export type WalletActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function requestWithdrawalAction(_: WalletActionState, formData: FormData): Promise<WalletActionState> {
  const parsed = withdrawalSchema.safeParse({
    amount: formData.get("amount"),
    accountName: formData.get("accountName"),
    accountNumber: formData.get("accountNumber"),
    bankName: formData.get("bankName"),
    mobileWalletNumber: formData.get("mobileWalletNumber"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid withdrawal request.";
    return { status: "error", message: firstError };
  }

  const auth = await getCurrentUser();
  if (!auth?.profile || (auth.profile as { role: string }).role !== "freelancer") {
    return { status: "error", message: "Only freelancers can request withdrawals." };
  }

  const db = getDB();
  if (!db) {
    return { status: "error", message: "Database not available." };
  }

  try {
    const requestId = generateId();
    await db
      .prepare(
        `INSERT INTO withdrawal_requests (id, freelancer_id, amount, bank_account_name, bank_account_number, bank_name, mobile_wallet_number, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`
      )
      .bind(
        requestId,
        (auth.profile as { id: string }).id,
        parsed.data.amount,
        parsed.data.accountName,
        parsed.data.accountNumber,
        parsed.data.bankName,
        parsed.data.mobileWalletNumber ?? null
      )
      .run();

    revalidatePath("/freelancer/wallet");

    return { status: "success", message: "Withdrawal request submitted. We will review and process it shortly." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Failed to submit withdrawal request." };
  }
}

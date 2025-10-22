'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";

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

type WalletActionState = {
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
  if (!auth?.profile || auth.profile.role !== "freelancer") {
    return { status: "error", message: "Only freelancers can request withdrawals." };
  }

  const supabase = createSupabaseServerClient();

  const { error } = await supabase.from("withdrawal_requests").insert({
    freelancer_id: auth.profile.id,
    amount: parsed.data.amount,
    bank_account_name: parsed.data.accountName,
    bank_account_number: parsed.data.accountNumber,
    bank_name: parsed.data.bankName,
    mobile_wallet_number: parsed.data.mobileWalletNumber ?? null,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/freelancer/wallet");

  return { status: "success", message: "Withdrawal request submitted. We will review and process it shortly." };
}

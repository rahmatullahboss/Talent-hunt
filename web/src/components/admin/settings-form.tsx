"use client";

import { useEffect, useTransition } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { updateAdminSettingsAction } from "@/actions/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState = { status: "idle" as const, message: undefined as string | undefined };

export function AdminSettingsForm({ settings }: {
  settings: {
    commission_percentage: number;
    bank_account_name: string | null;
    bank_account_number: string | null;
    bank_name: string | null;
    mobile_wallet_provider: string | null;
    mobile_wallet_number: string | null;
  } | null;
}) {
  const [state, formAction] = useFormState(updateAdminSettingsAction, initialState);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state.status === "error" && state.message) {
      toast.error(state.message);
    } else if (state.status === "success" && state.message) {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      action={(formData) => {
        startTransition(() => formAction(formData));
      }}
    >
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted" htmlFor="commission">
          Platform commission (%)
        </label>
        <Input id="commission" name="commission" type="number" min={0} max={100} step="1" defaultValue={settings?.commission_percentage ?? 10} />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted" htmlFor="bankAccountName">
          Bank account name
        </label>
        <Input id="bankAccountName" name="bankAccountName" defaultValue={settings?.bank_account_name ?? ""} />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted" htmlFor="bankAccountNumber">
          Bank account number
        </label>
        <Input id="bankAccountNumber" name="bankAccountNumber" defaultValue={settings?.bank_account_number ?? ""} />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted" htmlFor="bankName">
          Bank name
        </label>
        <Input id="bankName" name="bankName" defaultValue={settings?.bank_name ?? ""} />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted" htmlFor="walletProvider">
          Mobile wallet provider
        </label>
        <Input id="walletProvider" name="walletProvider" defaultValue={settings?.mobile_wallet_provider ?? ""} />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted" htmlFor="walletNumber">
          Mobile wallet number
        </label>
        <Input id="walletNumber" name="walletNumber" defaultValue={settings?.mobile_wallet_number ?? ""} />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" loading={isPending}>
          Save settings
        </Button>
      </div>
    </form>
  );
}

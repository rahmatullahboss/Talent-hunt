"use client";

import { useEffect, useTransition } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { requestWithdrawalAction, type WalletActionState } from "@/actions/wallet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: WalletActionState = { status: "idle" };

export function WithdrawalForm() {
  const [state, formAction] = useFormState(requestWithdrawalAction, initialState);
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
      className="space-y-4"
      action={(formData) => {
        startTransition(() => formAction(formData));
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted" htmlFor="amount">
            Amount (BDT)
          </label>
          <Input id="amount" name="amount" type="number" min={500} step="100" placeholder="5000" required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted" htmlFor="bankName">
            Bank name
          </label>
          <Input id="bankName" name="bankName" placeholder="BRAC Bank" required />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted" htmlFor="accountName">
            Account holder name
          </label>
          <Input id="accountName" name="accountName" placeholder="Md. Rahman" required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted" htmlFor="accountNumber">
            Account number
          </label>
          <Input id="accountNumber" name="accountNumber" placeholder="1234567890" required />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted" htmlFor="mobileWalletNumber">
          Mobile wallet (optional)
        </label>
        <Input id="mobileWalletNumber" name="mobileWalletNumber" placeholder="017XXXXXXXX" />
      </div>

      <Button type="submit" loading={isPending}>
        Submit withdrawal request
      </Button>
    </form>
  );
}

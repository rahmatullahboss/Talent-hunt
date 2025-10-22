"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "muted" | "success" | "danger";

const variants: Record<Variant, string> = {
  default: "bg-foreground text-background",
  outline: "border border-card-border text-foreground",
  muted: "bg-foreground/10 text-foreground",
  success: "bg-emerald-500/15 text-emerald-600",
  danger: "bg-red-500/15 text-red-600",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

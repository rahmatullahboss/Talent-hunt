"use client";

import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[var(--radius-lg)] border border-card-border bg-card p-6 shadow-sm shadow-foreground/5",
      className,
    )}
    {...props}
  />
));

Card.displayName = "Card";

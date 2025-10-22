"use client";

import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "ghost" | "outline" | "destructive";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  default: "bg-accent text-accent-foreground hover:opacity-90",
  secondary: "bg-foreground/5 text-foreground hover:bg-foreground/10",
  outline: "border border-card-border bg-card text-foreground hover:border-accent hover:text-accent",
  ghost: "text-foreground hover:bg-foreground/10",
  destructive: "bg-red-500 text-white hover:bg-red-600",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    asChild,
    className,
    variant = "default",
    size = "md",
    loading,
    children,
    disabled,
    ...props
  }, ref) => {
    const Component = asChild ? Slot : "button";
    const commonClassName = cn(
      "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-60",
      variants[variant],
      sizes[size],
      className,
    );

    if (asChild) {
      return (
        <Component ref={ref} className={commonClassName} {...props}>
          {children}
        </Component>
      );
    }

    return (
      <Component
        ref={ref}
        className={commonClassName}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
              aria-hidden="true"
            />
            <span className="sr-only">Loading</span>
          </>
        ) : null}
        <span>{children}</span>
      </Component>
    );
  },
);

Button.displayName = "Button";

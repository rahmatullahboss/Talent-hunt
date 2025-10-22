"use client";

import Image from "next/image";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizes: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-2xl",
};

export function Avatar({ src, alt, fallback, size = "md", className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-foreground/10 text-foreground",
        sizes[size],
        className,
      )}
      {...props}
    >
      {src ? (
        <Image src={src} alt={alt ?? "Profile avatar"} fill className="object-cover" />
      ) : (
        <span className="font-semibold uppercase">{fallback?.slice(0, 2) ?? "?"}</span>
      )}
    </div>
  );
}

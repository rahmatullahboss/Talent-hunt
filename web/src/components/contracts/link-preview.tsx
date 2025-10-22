"use client";

import { ExternalLink } from "lucide-react";
import clsx from "clsx";

function formatLinkForDisplay(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const path = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    const cleanedPath = path && path !== "/" ? decodeURI(path) : undefined;
    return {
      host,
      label: cleanedPath ?? host,
      initials: host.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || host.slice(0, 2).toUpperCase(),
    };
  } catch {
    return {
      host: url.replace(/^https?:\/\//, ""),
      label: url,
      initials: url.slice(0, 2).toUpperCase(),
    };
  }
}

export function LinkPreview({ url, isCurrent }: { url: string; isCurrent: boolean }) {
  const { host, label, initials } = formatLinkForDisplay(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        "group block w-full overflow-hidden rounded-[var(--radius-md)] border text-left shadow-sm transition hover:-translate-y-[1px] hover:shadow-md",
        isCurrent
          ? "border-accent-foreground/20 bg-accent/90 text-accent-foreground"
          : "border-card-border/70 bg-card text-foreground"
      )}
    >
      <div className="flex items-center gap-3 p-3">
        <div
          className={clsx(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-sm font-semibold",
            isCurrent ? "bg-accent-foreground/15 text-accent-foreground" : "bg-foreground/10 text-foreground"
          )}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{host}</p>
          <p
            className={clsx(
              "truncate text-xs",
              isCurrent ? "text-accent-foreground/80" : "text-muted-foreground"
            )}
          >
            {label}
          </p>
        </div>
        <ExternalLink
          className={clsx(
            "h-4 w-4 shrink-0 transition group-hover:translate-x-[1px] group-hover:-translate-y-[1px]",
            isCurrent ? "text-accent-foreground/80" : "text-muted-foreground"
          )}
        />
      </div>
    </a>
  );
}

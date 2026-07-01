"use client";

import { useEffect, useState } from "react";
import { getOpenStatus, type OpenStatus as OpenStatusType } from "@/lib/hours";
import { cn } from "@/lib/utils";

/**
 * Live open / closed indicator. Computed on the client (and refreshed every
 * minute) so it never goes stale. To avoid a hydration mismatch we render a
 * neutral placeholder until mounted, then swap in the real status.
 */
export function OpenStatus({
  className,
  variant = "pill",
}: {
  className?: string;
  variant?: "pill" | "inline";
}) {
  const [status, setStatus] = useState<OpenStatusType | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus(new Date()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  const dotColor = !status
    ? "bg-forest-200"
    : status.open
      ? status.closingSoon
        ? "bg-gold-500"
        : "bg-forest-400"
      : "bg-forest-300";

  const label = status ? status.label : "Hours";

  const dot = (
    <span className="relative flex h-2 w-2 shrink-0">
      {/* Calm static indicator — a soft ring for "open", no pulsing/blinking. */}
      {status?.open && (
        <span
          className={cn(
            "absolute -inset-1 rounded-full opacity-30",
            status.closingSoon ? "bg-gold-500/40" : "bg-forest-400/40"
          )}
        />
      )}
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", dotColor)} />
    </span>
  );

  if (variant === "inline") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 text-xs font-medium text-forest-600",
          className
        )}
      >
        {dot}
        {label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-cream-300 bg-white px-3 py-1 text-xs font-medium text-forest-700",
        className
      )}
    >
      {dot}
      {label}
    </span>
  );
}

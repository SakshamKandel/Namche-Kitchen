import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Derive a 0–3 spice level from a dish's tags and (optionally) its name.
 *
 * - A `spicy` tag starts the dish at level 2.
 * - Heat keywords in the name (chilli/chili/jhol/hot/fiery) nudge it toward 3.
 * - With neither a `spicy` tag nor a heat keyword, the level is 0.
 *
 * Pure and hook-free, so it is safe to call in Server Components.
 */
export function spiceLevelFor(tags: string[], name?: string): number {
  const hasSpicyTag = tags.includes("spicy");
  const lowered = (name ?? "").toLowerCase();
  const hasKeyword = /chilli|chili|jhol|hot|fiery/.test(lowered);

  if (!hasSpicyTag && !hasKeyword) return 0;

  let level = hasSpicyTag ? 2 : 0;
  if (hasKeyword) level += 1;
  // Never start above 0 from a keyword-only match; keep within 0..3.
  if (level < 1) level = 1;
  return Math.min(3, level);
}

/**
 * A small row of chilli/flame marks indicating heat. Renders nothing at
 * level 0. Hook-free and server-safe.
 */
export function SpiceMeter({
  level,
  className,
}: {
  level: number;
  className?: string;
}) {
  if (level <= 0) return null;

  const clamped = Math.min(3, Math.max(0, Math.round(level)));
  const muted = 3 - clamped;

  return (
    <span
      role="img"
      aria-label={`Spice level ${clamped} of 3`}
      className={cn("inline-flex items-center gap-0.5", className)}
    >
      {Array.from({ length: clamped }).map((_, i) => (
        <Flame
          key={`hot-${i}`}
          aria-hidden="true"
          className="h-3.5 w-3.5 text-spice-500"
        />
      ))}
      {Array.from({ length: muted }).map((_, i) => (
        <Flame
          key={`cool-${i}`}
          aria-hidden="true"
          className="h-3.5 w-3.5 text-forest-200"
        />
      ))}
    </span>
  );
}

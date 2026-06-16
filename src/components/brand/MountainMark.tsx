import { cn } from "@/lib/utils";

/**
 * The Namche mountain glyph. `tone` controls the palette so it reads well on
 * both cream and forest backgrounds.
 */
export function MountainMark({
  className,
  tone = "forest",
}: {
  className?: string;
  tone?: "forest" | "cream";
}) {
  const peak = tone === "cream" ? "var(--color-cream-50)" : "var(--color-forest-700)";
  const snow = tone === "cream" ? "var(--color-forest-800)" : "var(--color-cream-50)";
  const sun = "var(--color-gold-400)";

  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("h-8 w-8", className)}
      role="img"
      aria-label="Namche Kitchen"
      fill="none"
    >
      <circle cx="44" cy="21" r="7" fill={sun} />
      <path d="M4 54 L24 16 L35 37 L42 24 L60 54 Z" fill={peak} />
      <path
        d="M24 16 L18.5 27 L21.5 25.6 L24 30 L26.5 25.6 L29.5 27 Z"
        fill={snow}
      />
    </svg>
  );
}

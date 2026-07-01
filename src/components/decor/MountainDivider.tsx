import { cn } from "@/lib/utils";

/**
 * A signature Himalayan mountain-ridge divider used at section transitions.
 * Renders a layered ridge silhouette: `skyClass` paints the sky (usually the
 * colour of the section ABOVE), `rangeClass` sets the mountain colour (usually
 * the section BELOW) via currentColor. Purely decorative.
 */
export function MountainDivider({
  className,
  skyClass = "bg-forest-950",
  rangeClass = "text-sand-100",
  flip = false,
}: {
  className?: string;
  skyClass?: string;
  rangeClass?: string;
  /** Flip vertically so the range hangs from the top instead of rising. */
  flip?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative w-full overflow-hidden leading-[0]",
        skyClass,
        className
      )}
    >
      <svg
        viewBox="0 0 1440 110"
        preserveAspectRatio="none"
        className={cn(
          "block h-[70px] w-full sm:h-[100px]",
          rangeClass,
          flip && "rotate-180"
        )}
      >
        {/* A single clean mountain range — no highlights, no overlaps. */}
        <path
          fill="currentColor"
          d="M0,110 L0,60 L120,34 L230,62 L360,22 L500,58 L620,28 L770,60 L900,20 L1040,52 L1180,26 L1320,58 L1440,34 L1440,110 Z"
        />
      </svg>
    </div>
  );
}

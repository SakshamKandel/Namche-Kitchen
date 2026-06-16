/**
 * A decorative, non-interactive layer of scattered food doodles.
 *
 * Drop it as the FIRST child of a section that has `relative isolate` — it
 * paints behind the section's content (it uses `-z-10`) but above the section
 * background, so text and cards stay perfectly readable. It is `aria-hidden`,
 * `pointer-events-none`, and clips its own overflow, so it never affects layout
 * or scrolling. Placement is deterministic (SSR-safe).
 *
 *   <section className="relative isolate ...">
 *     <DoodleScatter preset="soft" />
 *     <Container> … real content … </Container>
 *   </section>
 *
 * Motion is CSS-only and is disabled automatically under
 * `prefers-reduced-motion`.
 */
import { cn } from "@/lib/utils";
import { Doodle, type DoodleName } from "./FoodDoodles";

type ScatterItem = { name: DoodleName; cls: string };

/** Curated arrangements. Colours/sizes live here so pages stay tidy. */
const PRESETS = {
  /** Light cream sections — a quiet sprinkle around the edges. */
  soft: [
    { name: "momo", cls: "left-[3%] top-[16%] h-14 w-14 text-forest-200 animate-doodle-float" },
    { name: "chilli", cls: "right-[5%] top-[14%] h-12 w-12 text-spice-300 animate-doodle-sway" },
    { name: "leaf", cls: "left-[9%] bottom-[12%] h-12 w-12 text-forest-200 animate-doodle-float-slow" },
    { name: "steam", cls: "right-[10%] bottom-[18%] h-12 w-12 text-forest-100 animate-doodle-float" },
    { name: "sparkle", cls: "left-[44%] top-[7%] h-7 w-7 text-gold-300 animate-doodle-float-slow" },
    { name: "citrus", cls: "right-[38%] bottom-[8%] h-9 w-9 text-gold-300 animate-doodle-drift" },
  ],
  /** Denser sprinkle for big hero / header areas. */
  rich: [
    { name: "momo", cls: "left-[4%] top-[12%] h-16 w-16 text-forest-200 animate-doodle-float" },
    { name: "steam", cls: "left-[2%] bottom-[20%] h-12 w-12 text-forest-100 animate-doodle-float-slow" },
    { name: "chilli", cls: "right-[6%] top-[10%] h-14 w-14 text-spice-300 animate-doodle-sway" },
    { name: "tea", cls: "right-[3%] bottom-[14%] h-16 w-16 text-forest-200 animate-doodle-float" },
    { name: "leaf", cls: "left-[16%] bottom-[8%] h-12 w-12 text-forest-200 animate-doodle-float-slow" },
    { name: "citrus", cls: "right-[20%] top-[8%] h-10 w-10 text-gold-300 animate-doodle-drift" },
    { name: "sparkle", cls: "left-[40%] top-[6%] h-8 w-8 text-gold-300 animate-doodle-float" },
    { name: "samosa", cls: "right-[34%] bottom-[10%] h-11 w-11 text-spice-300 animate-doodle-float-slow" },
    { name: "mountain", cls: "left-[30%] bottom-[6%] h-12 w-12 text-forest-100 animate-doodle-float" },
  ],
  /** Dark forest bands — faint cream / gold strokes. */
  band: [
    { name: "momo", cls: "left-[4%] top-[18%] h-16 w-16 text-cream-50/10 animate-doodle-float" },
    { name: "steam", cls: "right-[6%] top-[16%] h-14 w-14 text-cream-50/10 animate-doodle-float-slow" },
    { name: "leaf", cls: "left-[12%] bottom-[14%] h-12 w-12 text-cream-50/10 animate-doodle-sway" },
    { name: "sparkle", cls: "right-[16%] bottom-[20%] h-8 w-8 text-gold-400/20 animate-doodle-float" },
    { name: "mountain", cls: "right-[40%] top-[10%] h-12 w-12 text-cream-50/10 animate-doodle-drift" },
  ],
  /** Just the corners — for compact sections. */
  corners: [
    { name: "leaf", cls: "left-[4%] top-[14%] h-12 w-12 text-forest-200 animate-doodle-float-slow" },
    { name: "chilli", cls: "right-[5%] bottom-[14%] h-12 w-12 text-spice-300 animate-doodle-sway" },
    { name: "sparkle", cls: "right-[8%] top-[16%] h-7 w-7 text-gold-300 animate-doodle-float" },
  ],
  /** Footer — a low row of doodles. */
  footer: [
    { name: "momo", cls: "left-[6%] top-[18%] h-12 w-12 text-forest-100 animate-doodle-float" },
    { name: "tea", cls: "right-[8%] top-[22%] h-12 w-12 text-forest-100 animate-doodle-float-slow" },
    { name: "leaf", cls: "left-[40%] bottom-[10%] h-10 w-10 text-forest-100 animate-doodle-sway" },
    { name: "steam", cls: "right-[32%] top-[14%] h-10 w-10 text-forest-100 animate-doodle-float" },
  ],
} satisfies Record<string, ScatterItem[]>;

export type DoodlePreset = keyof typeof PRESETS;

export function DoodleScatter({
  preset = "soft",
  className,
  items,
}: {
  preset?: DoodlePreset;
  className?: string;
  /** Override the preset with a fully custom arrangement. */
  items?: ScatterItem[];
}) {
  const list = items ?? PRESETS[preset];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className
      )}
    >
      {list.map((it, i) => (
        <span key={i} className={cn("absolute block", it.cls)}>
          <Doodle name={it.name} className="h-full w-full" strokeWidth={1.75} />
        </span>
      ))}
    </div>
  );
}

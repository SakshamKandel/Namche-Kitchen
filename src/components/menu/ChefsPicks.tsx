"use client";

import { useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { DishImage } from "@/components/menu/DishImage";
import { SpiceMeter, spiceLevelFor } from "@/components/menu/SpiceMeter";
import type { MenuDish } from "@/components/menu/MenuExplorer";
import { cn, displayPrice, parseTags } from "@/lib/utils";

// ── Tag → display label ─────────────────────────────────────────────────────

const TAG_LABELS: Record<string, string> = {
  halal: "Halal",
  vegetarian: "Veg",
  vegan: "Vegan",
  spicy: "Spicy",
  popular: "Popular",
  new: "New",
};

/** First matching badge, mirroring the priority used across the menu cards. */
function badgeFor(tags: string[]): string | null {
  if (tags.includes("popular")) return "Popular";
  if (tags.includes("halal")) return "Halal";
  if (tags.includes("spicy")) return "Spicy";
  if (tags.includes("vegan")) return "Vegan";
  if (tags.includes("vegetarian")) return "Veg";
  return null;
}

/** A couple of dietary pills for the meta row, excluding the badge already shown. */
function dietaryPills(tags: string[]): string[] {
  return tags
    .filter((t) => t in TAG_LABELS)
    .map((t) => TAG_LABELS[t])
    .filter((label, i, arr) => arr.indexOf(label) === i)
    .slice(0, 2);
}

// ── Component ───────────────────────────────────────────────────────────────

export function ChefsPicks({
  dishes,
  onSelect,
  isFavourite,
  onToggleFavourite,
}: {
  dishes: MenuDish[];
  onSelect: (dish: MenuDish) => void;
  isFavourite: (id: string) => boolean;
  onToggleFavourite: (id: string) => void;
}): React.ReactElement | null {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollBy = useCallback((direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    // Roughly one card width (w-72 = 288px) plus the gap-4 (16px).
    const amount = Math.min(rail.clientWidth * 0.9, 304);
    rail.scrollBy({ left: direction * amount, behavior: "smooth" });
  }, []);

  if (dishes.length === 0) return null;

  return (
    <section className="border-b border-forest-800/60 bg-forest-950 py-14 sm:py-16">
      <Container size="wide">
        {/* Heading */}
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
                Made fresh daily
              </span>
              <h2 className="font-display text-3xl text-cream-50 sm:text-4xl">
                Chef&rsquo;s picks
              </h2>
              <p className="text-cream-200/60">
                A handful of the dishes our kitchen is proud of today.
              </p>
            </div>

            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Scroll chef's picks left"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-forest-700/70 text-cream-200/70 transition-colors hover:border-gold-400/50 hover:text-gold-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400/70"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Scroll chef's picks right"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-forest-700/70 text-cream-200/70 transition-colors hover:border-gold-400/50 hover:text-gold-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400/70"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Rail */}
        <div
          ref={railRef}
          className="scrollbar-none flex gap-4 overflow-x-auto pb-2 [scroll-snap-type:x_mandatory]"
        >
          {dishes.map((dish) => {
            const tags = parseTags(dish.tags);
            const badge = badgeFor(tags);
            const pills = dietaryPills(tags);
            const price = displayPrice(dish);
            const spice =
              dish.spiceLevel != null && dish.spiceLevel > 0
                ? dish.spiceLevel
                : spiceLevelFor(tags, dish.name);
            const favourite = isFavourite(dish.id);

            return (
              <button
                key={dish.id}
                type="button"
                onClick={() => onSelect(dish)}
                className="group flex w-64 shrink-0 flex-col overflow-hidden rounded-2xl border border-forest-700/60 bg-forest-800/40 text-left transition duration-300 [scroll-snap-align:start] hover:-translate-y-1 hover:border-gold-400/40 hover:shadow-[0_22px_42px_-18px_rgba(0,0,0,0.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400/70 sm:w-72"
              >
                {/* Image */}
                <div className="relative aspect-[4/3]">
                  <DishImage
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="absolute inset-0"
                    sizes="288px"
                  />

                  {badge && (
                    <span className="absolute left-2.5 top-2.5 inline-flex items-center rounded-full border border-gold-400/40 bg-forest-950/70 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-gold-400 backdrop-blur-sm">
                      {badge}
                    </span>
                  )}

                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavourite(dish.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleFavourite(dish.id);
                      }
                    }}
                    aria-label={
                      favourite
                        ? `Remove ${dish.name} from favourites`
                        : `Add ${dish.name} to favourites`
                    }
                    aria-pressed={favourite}
                    className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-forest-700/70 bg-forest-950/70 text-cream-200/70 backdrop-blur-sm transition-colors hover:border-gold-400/50 hover:text-gold-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400/70"
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 transition-colors",
                        favourite && "fill-gold-400 text-gold-400"
                      )}
                    />
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col gap-1.5 p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-base font-medium leading-tight text-cream-50">
                      {dish.name}
                    </h3>
                    {price && (
                      <span className="shrink-0 font-display text-sm tabular-nums text-gold-400">
                        {price}
                      </span>
                    )}
                  </div>

                  {(spice > 0 || pills.length > 0) && (
                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-1.5">
                      {spice > 0 && <SpiceMeter level={spice} />}
                      {pills.map((label) => (
                        <span
                          key={label}
                          className="rounded-full border border-gold-400/30 px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-gold-400/90"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

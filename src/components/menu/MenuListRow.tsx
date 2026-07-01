"use client";

import { Flame, Heart, Plus, Sparkles } from "lucide-react";
import { displayPrice, parseTags, cn } from "@/lib/utils";
import { spiceLevelFor } from "@/components/menu/SpiceMeter";
import { DishImage } from "@/components/menu/DishImage";
import { DishHoverCard } from "@/components/menu/DishHoverCard";
import { SITE } from "@/lib/constants";
import type { MenuDish } from "@/components/menu/MenuExplorer";

/** Short labels for dietary/marketing tags as they appear on the dark menu. */
const TAG_LABEL: Record<string, string> = {
  halal: "Halal",
  vegetarian: "Veg",
  vegan: "Vegan",
  spicy: "Spicy",
  popular: "Popular",
  new: "New",
};

/** A small inline heat gauge tuned for dark backgrounds (gold = lit). */
function Heat({ level }: { level: number }) {
  const lit = Math.min(3, Math.max(0, Math.round(level)));
  if (lit <= 0) return null;
  return (
    <span
      role="img"
      aria-label={`Spice level ${lit} of 3`}
      className="inline-flex items-center gap-0.5"
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <Flame
          key={i}
          aria-hidden
          className={cn(
            "h-3.5 w-3.5",
            i < lit ? "text-spice-400" : "text-forest-700"
          )}
        />
      ))}
    </span>
  );
}

/**
 * An editorial, restaurant-style menu line for the dark menu page:
 * thumbnail · name + featured star · dotted leader · gold price · options ·
 * description · dietary pills + spice. The whole dish (thumbnail + text) is a
 * hover-preview trigger that opens the full quick-view on click; a heart saves
 * it to favourites and a quiet "add" button links to online ordering.
 */
export function MenuListRow({
  item,
  onSelect,
  isFavourite,
  onToggleFavourite,
}: {
  item: MenuDish;
  onSelect?: (item: MenuDish) => void;
  isFavourite?: (id: string) => boolean;
  onToggleFavourite?: (id: string) => void;
}) {
  const tags = parseTags(item.tags);
  const price = displayPrice(item);
  const spice =
    item.spiceLevel != null && item.spiceLevel > 0
      ? item.spiceLevel
      : spiceLevelFor(tags, item.name);
  const featured = Boolean(item.featured) || tags.includes("popular");
  const pills = tags.filter((t) => t !== "popular");
  const fav = isFavourite?.(item.id) ?? false;

  return (
    <li className="group relative border-b border-cream-200/10 py-5 last:border-b-0">
      <div className="flex items-start gap-4">
        {/* Thumbnail + text — the hover-preview / open-details trigger */}
        <DishHoverCard
          dish={item}
          onOpen={onSelect ? () => onSelect(item) : undefined}
          className="flex min-w-0 flex-1 items-start gap-4"
        >
          <DishImage
            src={item.imageUrl}
            alt={item.name}
            sizes="80px"
            className="h-16 w-16 shrink-0 rounded-lg sm:h-[4.5rem] sm:w-[4.5rem]"
          />

          <div className="min-w-0 flex-1">
            {/* Name · dotted leader · price */}
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="flex items-center gap-1.5 font-display text-lg font-medium leading-snug text-cream-50">
                {item.name}
                {featured && (
                  <Sparkles
                    aria-label="House favourite"
                    className="h-3.5 w-3.5 shrink-0 text-gold-400"
                  />
                )}
              </h3>
              <span
                aria-hidden
                className="mx-2 hidden flex-1 translate-y-[-0.2em] border-b border-dotted border-cream-200/20 sm:block"
              />
              {price && (
                <span className="shrink-0 font-display text-base tabular-nums text-gold-400">
                  {price}
                </span>
              )}
            </div>

            {/* Options (e.g. Chicken / Vegetarian) */}
            {item.options && (
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-cream-200/45">
                {item.options}
              </p>
            )}

            {/* Description */}
            {item.description && (
              <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-cream-200/65">
                {item.description}
              </p>
            )}

            {/* Meta row: spice + dietary pills */}
            {(spice > 0 || pills.length > 0) && (
              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {spice > 0 && <Heat level={spice} />}
                {pills.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-gold-400/30 px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-gold-400/90"
                  >
                    {TAG_LABEL[tag] ?? tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </DishHoverCard>

        {/* Actions — favourite + add to order */}
        <div className="mt-0.5 flex shrink-0 flex-col items-center gap-2">
          {onToggleFavourite && (
            <button
              type="button"
              onClick={() => onToggleFavourite(item.id)}
              aria-pressed={fav}
              aria-label={
                fav
                  ? `Remove ${item.name} from favourites`
                  : `Save ${item.name} to favourites`
              }
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-forest-700/70 text-cream-200/60 transition-colors hover:border-gold-400/50 hover:text-gold-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-400/60"
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  fav && "fill-gold-400 text-gold-400"
                )}
              />
            </button>
          )}

          <a
            href={SITE.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Order ${item.name} online`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-forest-700/70 text-cream-200/60 opacity-0 transition-all duration-200 hover:border-gold-400 hover:bg-gold-400 hover:text-forest-900 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <Plus className="h-4 w-4" />
          </a>
        </div>
      </div>
    </li>
  );
}

"use client";

import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { MountainMark } from "@/components/brand/MountainMark";
import { cn, formatPrice, parseTags } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { SpiceMeter, spiceLevelFor } from "@/components/menu/SpiceMeter";

export type DishLike = {
  id?: string;
  name: string;
  description?: string | null;
  price?: number | null;
  priceLabel?: string | null;
  imageUrl?: string | null;
  options?: string | null;
  tags?: string | null;
  spiceLevel?: number | null;
  category?: { name: string } | null;
};

function badgeFor(tags: string[]): string | null {
  if (tags.includes("popular")) return "Popular";
  if (tags.includes("halal")) return "Halal";
  if (tags.includes("spicy")) return "Spicy";
  if (tags.includes("vegan")) return "Vegan";
  if (tags.includes("vegetarian")) return "Veg";
  return null;
}

/** Photo card — used for featured dishes and menu grids. */
export function MenuItemCard({
  item,
  className,
  onSelect,
  isFavourite,
  onToggleFavourite,
}: {
  item: DishLike;
  className?: string;
  onSelect?: (item: DishLike) => void;
  isFavourite?: (id: string) => boolean;
  onToggleFavourite?: (id: string) => void;
}) {
  const tags = parseTags(item.tags);
  const badge = badgeFor(tags);
  const spice =
    item.spiceLevel != null && item.spiceLevel > 0
      ? item.spiceLevel
      : spiceLevelFor(tags, item.name);

  const interactive = Boolean(onSelect);
  const fav = item.id && isFavourite ? isFavourite(item.id) : false;

  function open() {
    if (onSelect) onSelect(item);
  }

  return (
    <article
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? open : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open();
              }
            }
          : undefined
      }
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-forest-700/60 bg-forest-800/40 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-gold-400/40 hover:shadow-[0_22px_42px_-18px_rgba(0,0,0,0.6)]",
        interactive &&
          "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-950",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-forest-900">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 50vw, 300px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-forest-700/40 via-forest-800 to-forest-900">
            <MountainMark tone="cream" className="h-10 w-10 opacity-25" />
          </div>
        )}
        {badge && (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center rounded-full border border-gold-400/40 bg-forest-950/70 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-gold-400 backdrop-blur-sm">
            {badge}
          </span>
        )}

        {item.id && onToggleFavourite && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavourite(item.id!);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavourite(item.id!);
              }
            }}
            aria-pressed={fav}
            aria-label={
              fav
                ? `Remove ${item.name} from favourites`
                : `Save ${item.name} to favourites`
            }
            className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-forest-700/70 bg-forest-950/70 text-cream-200/70 backdrop-blur-sm transition-colors hover:border-gold-400/50 hover:text-gold-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-400/60"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                fav && "fill-gold-400 text-gold-400"
              )}
            />
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg font-medium leading-tight text-cream-50">
            {item.name}
          </h3>
          <span className="shrink-0 font-display text-base tabular-nums text-gold-400">
            {item.price != null
              ? formatPrice(item.price)
              : item.priceLabel ?? ""}
          </span>
        </div>

        {item.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-cream-200/65">
            {item.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          {spice > 0 ? (
            <SpiceMeter level={spice} />
          ) : (
            <span className="text-[0.62rem] font-medium uppercase tracking-[0.14em] text-cream-200/40">
              {item.options ?? item.category?.name ?? ""}
            </span>
          )}
          <a
            href={SITE.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Order ${item.name} online`}
            className="inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-3.5 py-1.5 text-xs font-semibold text-forest-900 transition-colors hover:bg-gold-300"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Order
          </a>
        </div>
      </div>
    </article>
  );
}

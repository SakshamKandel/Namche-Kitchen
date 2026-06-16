import Image from "next/image";
import { ShoppingBag } from "lucide-react";
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
}: {
  item: DishLike;
  className?: string;
}) {
  const tags = parseTags(item.tags);
  const badge = badgeFor(tags);
  const spice = item.spiceLevel != null && item.spiceLevel > 0
    ? item.spiceLevel
    : spiceLevelFor(tags, item.name);

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-subtle transition-shadow duration-200 hover:shadow-subtle",
        className
      )}
    >
      {/* Image container — dark bg, floating product */}
      <div className="relative mx-3 mt-3 aspect-square overflow-hidden rounded-xl bg-forest-800">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 50vw, 300px"
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <MountainMark tone="cream" className="h-10 w-10 opacity-30" />
          </div>
        )}
        {badge && (
          <span className="absolute right-2 top-2 inline-flex items-center rounded-md bg-forest-700/90 px-2 py-0.5 text-[0.65rem] font-medium text-cream-50 backdrop-blur-sm">
            {badge}
          </span>
        )}
      </div>

      {/* Gold separator */}
      <div className="my-3 flex justify-center">
        <div className="h-0.5 w-6 rounded-full bg-gold-400" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center gap-1 px-4 pb-4 text-center">
        <h3 className="text-sm font-semibold leading-tight text-forest-900">
          {item.name}
        </h3>

        {spice > 0 && <SpiceMeter level={spice} className="mt-0.5" />}

        {item.category?.name && (
          <p className="text-[0.65rem] font-medium uppercase tracking-wider text-forest-400">
            {item.category.name}
          </p>
        )}

        {item.price != null && (
          <span className="text-lg font-semibold text-forest-800">
            {formatPrice(item.price)}
          </span>
        )}

        {item.price == null && item.priceLabel && (
          <p className="text-xs font-medium text-forest-600">
            {item.priceLabel}
          </p>
        )}

        <a
          href={SITE.orderUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-forest-800 py-2 text-sm font-medium text-cream-50 transition-colors hover:bg-forest-700"
        >
          <ShoppingBag className="h-4 w-4" />
          Order
        </a>
      </div>
    </article>
  );
}

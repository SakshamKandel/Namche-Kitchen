import Image from "next/image";
import { cn, displayPrice, parseTags } from "@/lib/utils";
import { TagBadges } from "@/components/ui/TagBadges";
import { SpiceMeter, spiceLevelFor } from "@/components/menu/SpiceMeter";
import type { DishLike } from "./MenuItemCard";

/** Compact menu row with a dotted price leader — used on the full menu page. */
export function MenuItemRow({
  item,
  className,
}: {
  item: DishLike;
  className?: string;
}) {
  const price = displayPrice(item);
  const tags = parseTags(item.tags);
  const spice = item.spiceLevel != null && item.spiceLevel > 0
    ? item.spiceLevel
    : spiceLevelFor(tags, item.name);

  return (
    <div className={cn("group flex gap-4 py-4", className)}>
      {item.imageUrl && (
        <div className="relative hidden h-16 w-16 shrink-0 overflow-hidden rounded-xl sm:block">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-baseline gap-3">
          <h3 className="font-display text-base font-semibold text-forest-900">
            {item.name}
          </h3>
          <span className="h-px flex-1 translate-y-[-2px] border-b border-dotted border-forest-300/60" />
          {price && (
            <span className="shrink-0 text-sm font-semibold text-forest-700">
              {price}
            </span>
          )}
        </div>

        {item.description && (
          <p className="mt-1 max-w-prose text-sm leading-relaxed text-forest-700/70">
            {item.description}
          </p>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {spice > 0 && <SpiceMeter level={spice} />}
          {item.options && (
            <span className="text-xs font-medium uppercase tracking-wide text-forest-500">
              {item.options}
            </span>
          )}
          <TagBadges tags={item.tags} />
        </div>
      </div>
    </div>
  );
}

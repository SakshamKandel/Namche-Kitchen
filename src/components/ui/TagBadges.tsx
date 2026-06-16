import { TAG_META } from "@/lib/constants";
import { parseTags, cn } from "@/lib/utils";

export function TagBadges({
  tags,
  className,
}: {
  tags?: string | null;
  className?: string;
}) {
  const list = parseTags(tags);
  if (list.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {list.map((tag) => {
        const meta = TAG_META[tag];
        return (
          <span
            key={tag}
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold uppercase tracking-wide",
              meta?.className ?? "bg-forest-100 text-forest-600"
            )}
          >
            {meta?.label ?? tag}
          </span>
        );
      })}
    </div>
  );
}

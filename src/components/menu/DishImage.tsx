import Image from "next/image";
import { MountainMark } from "@/components/brand/MountainMark";
import { cn } from "@/lib/utils";

/**
 * Renders an uploaded dish photo, or an on-brand forest placeholder when the
 * owner hasn't added one yet. The placeholder keeps the layout intentional.
 */
export function DishImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 400px",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-forest-800",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-forest-600/40 via-forest-800 to-forest-900" />
      <MountainMark tone="cream" className="relative h-9 w-9 opacity-35" />
    </div>
  );
}

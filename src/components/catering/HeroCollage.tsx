import Image from "next/image";
import { cn } from "@/lib/utils";

type Tile = { src: string; alt: string };

/**
 * An offset 2×2 mosaic of food photos for the catering hero. On large screens
 * the tiles overlap into a staggered grid; on small screens it collapses to a
 * simpler two-up so it stays light and fast.
 */
export function HeroCollage({ className }: { className?: string }) {
  const tiles: Tile[] = [
    { src: "/menu/platter.jpg", alt: "A generous shared platter of Himalayan dishes" },
    { src: "/menu/curry.jpg", alt: "A rich, aromatic curry" },
    { src: "/menu/shawarma.jpg", alt: "Halal shawarma, freshly carved" },
    { src: "/menu/momo.webp", alt: "Hand-pleated steamed momo" },
  ];

  return (
    <div className={cn("relative mx-auto w-full max-w-lg", className)}>
      {/* Ambient glow behind the mosaic */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gold-400/10 blur-2xl"
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Large tile spanning two rows on the left */}
        <div className="relative row-span-2 aspect-[3/4] overflow-hidden rounded-3xl shadow-xl shadow-forest-950/30 ring-1 ring-cream-50/10 sm:mt-8">
          <Image
            src={tiles[0].src}
            alt={tiles[0].alt}
            fill
            sizes="(max-width: 1024px) 50vw, 280px"
            className="object-cover"
          />
        </div>

        <div className="relative aspect-square overflow-hidden rounded-3xl shadow-lg shadow-forest-950/30 ring-1 ring-cream-50/10">
          <Image
            src={tiles[1].src}
            alt={tiles[1].alt}
            fill
            sizes="(max-width: 1024px) 50vw, 240px"
            className="object-cover"
          />
        </div>

        <div className="relative aspect-square overflow-hidden rounded-3xl shadow-lg shadow-forest-950/30 ring-1 ring-cream-50/10">
          <Image
            src={tiles[2].src}
            alt={tiles[2].alt}
            fill
            sizes="(max-width: 1024px) 50vw, 240px"
            className="object-cover"
          />
        </div>

        {/* Fourth tile — hidden on the smallest screens to keep a clean 2-up */}
        <div className="relative col-span-2 hidden aspect-[16/9] overflow-hidden rounded-3xl shadow-lg shadow-forest-950/30 ring-1 ring-cream-50/10 sm:block">
          <Image
            src={tiles[3].src}
            alt={tiles[3].alt}
            fill
            sizes="(max-width: 1024px) 100vw, 520px"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}

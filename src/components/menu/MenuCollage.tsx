import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

/**
 * Appetising food collage for the menu header — a mosaic of signature dishes.
 * Each tile links to its category section further down the page.
 *
 * NOTE: these are placeholder stock photos so the page looks complete out of
 * the box. Replace the files in /public/menu with photos of the real dishes
 * (keep the same names) and they'll swap in automatically.
 */
const TILES: { src: string; label: string; alt: string; href: string }[] = [
  {
    src: "/menu/momo.webp",
    label: "Momo",
    alt: "Steamed Himalayan momo dumplings with achar",
    href: "#momo",
  },
  {
    src: "/menu/shawarma.jpg",
    label: "Shawarma",
    alt: "Halal chicken shawarma wrap",
    href: "#shawarma-sandwiches",
  },
  {
    src: "/menu/chowmein.jpg",
    label: "Chowmein",
    alt: "Wok-tossed noodles with vegetables",
    href: "#chowmein",
  },
  {
    src: "/menu/curry.jpg",
    label: "Curries",
    alt: "Aromatic curry served with bread",
    href: "#curry-comforts",
  },
  {
    src: "/menu/platter.jpg",
    label: "Platters",
    alt: "Shareable rice and meat platter",
    href: "#shawarma-platters",
  },
  {
    src: "/menu/falafel.jpg",
    label: "Falafel",
    alt: "Crispy chickpea falafel",
    href: "#shawarma-sandwiches",
  },
];

export function MenuCollage({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6",
        className
      )}
    >
      {TILES.map((tile, i) => (
        <Reveal key={tile.label} delay={0.04 * i} y={12}>
          <a
            href={tile.href}
            className="group relative block aspect-square overflow-hidden rounded-2xl border border-cream-200 bg-forest-800 shadow-subtle"
            aria-label={`Jump to ${tile.label} on the menu`}
          >
            <Image
              src={tile.src}
              alt={tile.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-900/85 via-forest-900/30 to-transparent px-3 pb-2.5 pt-9"
            >
              <span className="text-xs font-semibold tracking-wide text-cream-50 sm:text-sm">
                {tile.label}
              </span>
            </span>
          </a>
        </Reveal>
      ))}
    </div>
  );
}

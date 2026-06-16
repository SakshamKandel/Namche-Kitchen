import Image from "next/image";

type Plate = { src: string; label: string; alt: string };

const PLATES: Plate[] = [
  { src: "/menu/momo.webp", label: "Steamed Momo", alt: "Hand-pleated steamed momo" },
  { src: "/menu/shawarma.jpg", label: "Halal Shawarma", alt: "Freshly carved halal shawarma" },
  { src: "/menu/curry.jpg", label: "House Curries", alt: "A bowl of rich house curry" },
  { src: "/menu/platter.jpg", label: "Sharing Platters", alt: "A loaded sharing platter" },
  { src: "/menu/falafel.jpg", label: "Crispy Falafel", alt: "Golden, crispy falafel" },
  { src: "/menu/chowmein.jpg", label: "Veg Chowmein", alt: "Stir-fried vegetable chowmein" },
];

/**
 * A tasting-board strip of food photos with small label chips. Reads like a
 * scrollable row on mobile and a tidy grid from sm up.
 */
export function TastingBoard() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {PLATES.map((plate) => (
        <figure
          key={plate.label}
          className="group relative aspect-square overflow-hidden rounded-2xl shadow-subtle ring-1 ring-cream-200"
        >
          <Image
            src={plate.src}
            alt={plate.alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient scrim so the label always reads */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent"
          />
          <figcaption className="absolute inset-x-2 bottom-2">
            <span className="inline-flex rounded-full bg-cream-50/90 px-3 py-1 text-xs font-semibold text-forest-800 backdrop-blur-sm">
              {plate.label}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

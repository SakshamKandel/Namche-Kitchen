import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { buttonClasses } from "@/components/ui/Button";

type GalleryItem = {
  src: string;
  /** dish name shown as a small caption */
  name: string;
};

/** A tall feature image anchors the mosaic; the rest fill an editorial grid. */
const FEATURE: GalleryItem = {
  src: "/menu/momo-jhol.jpg",
  name: "Jhol Momo",
};

const TILES: GalleryItem[] = [
  { src: "/menu/chowmein.jpg", name: "Hakka Chowmein" },
  { src: "/menu/butter-chicken.jpg", name: "Butter Chicken" },
  { src: "/menu/shawarma-platter.jpg", name: "Halal Shawarma Platter" },
  { src: "/menu/salad.jpg", name: "Garden Salad" },
];

function GalleryFigure({
  item,
  className,
  imgClassName,
  priority,
}: {
  item: GalleryItem;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  return (
    <figure
      className={`group relative overflow-hidden rounded-2xl shadow-warm sm:rounded-3xl ${className ?? ""}`}
    >
      {/* plain <img>: real asset paths, no next/image optimization needed here */}
      <img
        src={item.src}
        alt={item.name}
        loading={priority ? "eager" : "lazy"}
        className={`h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] ${imgClassName ?? ""}`}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950/70 via-forest-950/10 to-transparent" />
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-3 px-5 pb-4 sm:px-6 sm:pb-5">
        <span className="block h-px w-6 bg-gold-400" />
        <span className="font-display text-base font-medium text-cream-50 sm:text-lg">
          {item.name}
        </span>
      </figcaption>
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-forest-700/40 sm:rounded-3xl" />
    </figure>
  );
}

export function GalleryStrip() {
  return (
    <section className="bg-grain border-t border-forest-800/40 bg-forest-950 py-20 sm:py-28">
      <Container size="wide">
        {/* Editorial header — gold eyebrow + short serif headline */}
        <Reveal>
          <div className="flex flex-col gap-3">
            <span className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
              <span className="block h-px w-12 bg-gold-400" />
              Straight from our kitchen
            </span>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="max-w-xl font-display text-4xl font-medium tracking-tight text-balance text-cream-50 sm:text-5xl">
                As good as it looks
              </h2>
              <p className="max-w-md text-pretty text-base leading-relaxed text-cream-200/75">
                Hand-folded, fire-kissed, and plated fresh — here&apos;s what&apos;s
                coming to your table in Ottawa.
              </p>
            </div>
          </div>
        </Reveal>

        {/*
          Asymmetric mosaic: a tall feature image anchors the left, with a
          2x2 cluster of smaller tiles to the right.
          - mobile: feature full-width, tiles in a 2-col grid below
          - lg: 5-col feature spanning both rows + four 3-col tiles (2 per row)
        */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-11 lg:grid-rows-2">
          <Reveal className="col-span-2 lg:col-span-5 lg:row-span-2">
            <GalleryFigure
              item={FEATURE}
              priority
              className="h-full min-h-[20rem] lg:min-h-[34rem]"
            />
          </Reveal>

          {TILES.map((item, i) => (
            <Reveal
              key={item.src}
              delay={Math.min((i + 1) * 0.06, 0.3)}
              className="col-span-1 lg:col-span-3 lg:row-span-1"
            >
              <GalleryFigure
                item={item}
                className="h-full min-h-[12rem] lg:min-h-[16.5rem]"
              />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 flex justify-center">
            <Link
              href="/menu"
              className={buttonClasses({
                variant: "outline",
                size: "lg",
                className:
                  "border-cream-50/30 text-cream-50 hover:bg-cream-50/10",
              })}
            >
              See the full menu
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

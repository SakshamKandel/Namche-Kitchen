import Link from "next/link";
import Image from "next/image";
import { Star, ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { OrderButton } from "@/components/site/OrderButton";
import { OpenStatus } from "@/components/site/OpenStatus";
import { MountainMark } from "@/components/brand/MountainMark";
import { Reveal } from "@/components/motion/Reveal";

/** A single framed photo card for the editorial "market table" cluster. */
function MarketCard({
  src,
  alt,
  label,
  className,
}: {
  src: string;
  alt: string;
  label: string;
  className?: string;
}) {
  return (
    <figure
      className={`group relative overflow-hidden rounded-2xl border-4 border-cream-50/90 shadow-warm ${className ?? ""}`}
    >
      <Image
        src={src}
        alt={alt}
        width={320}
        height={400}
        sizes="(min-width: 1024px) 20vw, 40vw"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <figcaption className="absolute bottom-2 left-2 rounded-full bg-forest-950/70 px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-cream-50 backdrop-blur-sm">
        {label}
      </figcaption>
    </figure>
  );
}

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden bg-forest-950 text-cream-100">
      {/* Full-bleed artisanal food photography — hands folding momo */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/ambiance/hands-momo.jpg"
          alt="Hands hand-pleating fresh Himalayan momos on a floured board"
          fill
          priority
          sizes="100vw"
          className="animate-kenburns object-cover object-center lg:object-[70%_center]"
        />
        {/* Base warm wash for overall legibility */}
        <div className="absolute inset-0 bg-forest-950/55" />
        {/* Left-to-right warm gradient anchoring the headline */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/85 to-forest-950/30 lg:via-forest-950/70 lg:to-transparent" />
        {/* Grounding fade at the base */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-forest-950 to-transparent" />
        {/* Subtle warm vignette for a cinematic edge (no glow) */}
        <div
          className="absolute inset-0"
          style={{
            boxShadow: "inset 0 0 200px 40px rgba(15, 26, 21, 0.55)",
          }}
        />
      </div>

      <Container className="py-20 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left — headline, copy, CTAs, trust */}
          <div className="max-w-2xl lg:col-span-7">
            <Reveal>
              <p className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.22em] text-gold-400">
                <MountainMark tone="cream" className="h-4 w-4 text-gold-400" />
                A Taste of the Himalayas
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <span className="mt-6 block h-px w-12 bg-gold-400" />
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-6 text-balance font-display text-4xl font-medium leading-[1.05] tracking-tight text-cream-50 sm:text-6xl sm:leading-[1.04] lg:text-[4.5rem]">
                Hand-folded in the Himalayas,
                <br className="hidden sm:block" /> served in Ottawa.
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-cream-200/75">
                Momos, masala &amp; halal shawarma — made fresh every day and
                served with Himalayan warmth.
              </p>
            </Reveal>

            <Reveal delay={0.16} className="w-full">
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <OrderButton
                  variant="gold"
                  size="lg"
                  label="Order Online"
                  className="w-full sm:w-auto"
                />
                <Link
                  href="/reservations"
                  className={buttonClasses({
                    variant: "outline",
                    size: "lg",
                    className:
                      "w-full justify-center border-cream-50/30 text-cream-50 hover:bg-cream-50/10 hover:border-cream-50/50 sm:w-auto",
                  })}
                >
                  Book a Table
                </Link>
                <Link
                  href="/menu"
                  className="inline-flex h-11 items-center justify-center px-2 text-[0.95rem] font-medium text-cream-100/80 underline-offset-4 transition-colors hover:text-cream-50 hover:underline"
                >
                  View menu
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-cream-50/10 pt-7 text-sm text-cream-200/70">
                <span className="flex items-center gap-1.5">
                  <span className="flex items-center" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-gold-400 text-gold-400"
                      />
                    ))}
                  </span>
                  <span className="font-semibold text-cream-50">4.8</span>
                  <span className="sr-only">out of 5 stars</span>
                </span>
                <span className="text-cream-50/20" aria-hidden>
                  &middot;
                </span>
                <span className="font-medium text-cream-100">100% Halal</span>
                <span className="text-cream-50/20" aria-hidden>
                  &middot;
                </span>
                <OpenStatus
                  variant="pill"
                  className="border-cream-50/20 bg-cream-50/10 text-cream-100"
                />
                <span className="text-cream-50/20" aria-hidden>
                  &middot;
                </span>
                <span>On DoorDash &amp; Uber Eats</span>
              </div>
            </Reveal>
          </div>

          {/* Right — editorial "market table" photo cluster (lg+ only) */}
          <div className="hidden lg:col-span-5 lg:block">
            <Reveal delay={0.28} y={26}>
              <div className="relative mx-auto h-[30rem] w-full max-w-md">
                {/* Back card — steamed momos */}
                <div className="absolute right-8 top-0 w-52 -rotate-6">
                  <MarketCard
                    src="/menu/momo-steam.jpg"
                    alt="A plate of freshly steamed Himalayan momos with achar"
                    label="Momo"
                    className="aspect-[4/5]"
                  />
                </div>
                {/* Accent card — halal shawarma */}
                <div className="absolute left-2 top-16 w-40 rotate-3">
                  <MarketCard
                    src="/menu/shawarma-wrap.jpg"
                    alt="A freshly wrapped halal shawarma"
                    label="Shawarma"
                    className="aspect-square"
                  />
                </div>
                {/* Front card — butter chicken */}
                <div className="absolute bottom-0 right-4 w-56 rotate-2">
                  <MarketCard
                    src="/menu/butter-chicken.jpg"
                    alt="Rich, creamy butter chicken in a rustic bowl"
                    label="Butter Chicken"
                    className="aspect-[5/4]"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center sm:flex">
        <span className="flex flex-col items-center gap-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-cream-100/55">
          Explore
          <ChevronDown className="h-4 w-4 animate-soft-bob" aria-hidden />
        </span>
      </div>
    </section>
  );
}

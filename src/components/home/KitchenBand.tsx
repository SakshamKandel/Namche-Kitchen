import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * KitchenBand — a cinematic full-bleed "flavours beyond borders" moment that
 * punctuates the page between the menu and the story. A warm kitchen photo under
 * a deep forest gradient carries a single meditative line and one underline link.
 * No buttons, no glow — it's a breather, not a CTA.
 */
export function KitchenBand() {
  return (
    <section className="relative isolate flex min-h-[54vh] items-center overflow-hidden py-16 sm:min-h-[62vh] sm:py-24">
      {/* Full-bleed kitchen photo */}
      <Image
        src="/ambiance/kitchen.jpg"
        alt="In the Namche Kitchen — hands at work over steaming pots and spice"
        fill
        priority={false}
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />

      {/* Warm forest gradient for legibility + brand tone */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-950/90 via-forest-950/70 to-forest-950/35"
      />
      {/* Faint film grain for a tactile, hand-crafted finish */}
      <div
        aria-hidden
        className="bg-grain absolute inset-0 -z-10 opacity-60 mix-blend-soft-light"
      />

      <Container>
        <Reveal className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
            Flavours beyond borders
          </span>
          <span className="mt-5 block h-px w-12 bg-gold-400" />
          <p className="mt-7 font-display text-3xl font-medium leading-snug text-balance text-cream-50 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Pleated by hand, simmered slow, and served with a little Himalayan
            warmth.
          </p>
          <Link
            href="/menu"
            className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-cream-100 transition-colors hover:text-gold-400"
          >
            <span className="border-b border-cream-100/40 pb-1 transition-colors group-hover:border-gold-400">
              See what&rsquo;s cooking
            </span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}

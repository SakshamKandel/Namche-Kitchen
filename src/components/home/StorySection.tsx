import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/** Quiet inline proof points shown beneath the story copy. */
const STATS: { value: string; label: string }[] = [
  { value: "Hand-folded", label: "Momo, fresh daily" },
  { value: "100% Halal", label: "Every dish, every day" },
  { value: "Family-owned", label: "Proudly in Ottawa" },
];

/**
 * Our Story — Himalayan heritage. A warm, editorial two-column section on a
 * paper-textured cream surface: clay eyebrow, serif headline, warm story copy
 * and an inline stat trio on the left; a framed Everest photograph with a
 * smaller overlapping hands-folding-momo photo and a brass "3,440 m" chip on
 * the right. Drops directly into the homepage.
 */
export function StorySection() {
  return (
    <section className="bg-paper overflow-x-clip bg-cream-50 py-20 sm:py-28">
      <Container className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        {/* Copy */}
        <Reveal className="flex flex-col gap-7">
          <div className="flex flex-col gap-5">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-clay-500">
              Our story
            </span>
            <h2 className="font-display text-4xl font-medium tracking-tight text-balance text-forest-900 sm:text-5xl sm:leading-[1.05]">
              From the gateway to Everest, to a table in Ottawa
            </h2>
            <span className="block h-px w-12 bg-gold-400" />
          </div>

          <div className="space-y-4 text-base leading-relaxed text-forest-700 text-pretty">
            <p>
              We named our kitchen after Namche Bazaar, the high-mountain town in
              the Nepali Himalayas where trekkers rest, refuel, and find a little
              warmth before the long climb ahead. That&apos;s the feeling we
              wanted to bring to Wellington West.
            </p>
            <p>
              Our family grew up on food made the slow way — momo pleated by hand
              one dumpling at a time, broths left to simmer overnight, spices
              toasted fresh instead of poured from a jar. We carried those recipes
              across the world and we still cook them the same way today, for our
              neighbours in Ottawa.
            </p>
            <p>
              Everything we serve is 100% halal, and everyone who walks through
              our door is family. Flavours beyond borders — that&apos;s not just
              our tagline, it&apos;s how we cook.
            </p>
          </div>

          {/* Inline proof points — sand-divided row, serif numerals */}
          <dl className="flex flex-wrap items-stretch gap-y-5 border-t border-sand-300 pt-7">
            {STATS.map((stat, i) => (
              <div
                key={stat.value}
                className={`flex flex-col gap-1.5 pr-8 ${
                  i > 0 ? "border-l border-sand-300 pl-8" : ""
                }`}
              >
                <dt className="font-display text-2xl text-clay-500 sm:text-[1.7rem]">
                  {stat.value}
                </dt>
                <dd className="text-xs uppercase tracking-[0.18em] text-forest-600">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>

          <Link
            href="/about"
            className="group inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-forest-800 transition-colors hover:text-forest-950"
          >
            Read our full story
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        {/* Image — a warm editorial arrangement: a tall framed Everest photo
            with a smaller hands-folding-momo photo overlapping its lower corner
            in a cream frame, plus a small brass altitude chip. */}
        <Reveal
          delay={0.1}
          className="relative mx-auto w-full max-w-md pb-14 pr-6 sm:pb-16 sm:pr-10 lg:mr-0 lg:max-w-none"
        >
          {/* Main framed photo — the Himalaya, gateway to Everest */}
          <div className="group relative overflow-hidden rounded-3xl border border-cream-300 bg-cream-100 p-2 shadow-warm">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="/ambiance/mountains.jpg"
                alt="The Himalayas near Namche Bazaar, prayer flags fluttering below Everest"
                fill
                sizes="(max-width: 1024px) 90vw, 460px"
                className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
            </div>

            {/* Brass altitude chip */}
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-gold-400/40 bg-forest-950/70 px-3.5 py-1.5 backdrop-blur-sm">
              <span className="font-display text-sm text-gold-400">3,440 m</span>
              <span className="text-[0.65rem] uppercase tracking-[0.18em] text-cream-200/75">
                Namche Bazaar
              </span>
            </div>
          </div>

          {/* Overlapping food photo — hands folding momo, cream frame */}
          <div className="group absolute -bottom-6 -right-4 w-[46%] rounded-2xl border border-cream-300 bg-cream-50 p-1.5 shadow-warm sm:-right-2 lg:-right-8">
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src="/ambiance/hands-momo.jpg"
                alt="Hands folding fresh momo by hand at Namche Kitchen"
                fill
                sizes="(max-width: 1024px) 42vw, 210px"
                className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
            </div>
            <span className="absolute -top-3 left-4 rounded-full bg-clay-500 px-2.5 py-0.5 font-display text-[0.7rem] tracking-wide text-cream-50 shadow-warm">
              Est. by hand
            </span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

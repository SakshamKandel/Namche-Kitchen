import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

const OCCASIONS = [
  "Corporate lunches & meetings",
  "Weddings & receptions",
  "Cultural gatherings & Eid feasts",
  "Birthdays & private parties",
] as const;

export function CateringTeaser() {
  return (
    <section className="bg-grain border-t border-forest-800/40 bg-forest-950 py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div className="max-w-xl">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
                Catering &amp; events
              </p>
            </Reveal>
            <Reveal delay={0.04}>
              <span className="mt-5 block h-px w-12 bg-gold-400" />
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-6 font-display text-4xl font-medium tracking-tight text-cream-50 sm:text-5xl">
                Himalayan flavours
                <br />
                for your table
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 text-lg leading-relaxed text-cream-200/75 text-pretty">
                From intimate gatherings to grand celebrations, we craft generous,
                halal-friendly spreads that bring people together — fully custom
                menus, made with care, right here in Ottawa.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <ul className="mt-8 flex flex-col gap-3">
                {OCCASIONS.map((occasion) => (
                  <li
                    key={occasion}
                    className="flex items-center gap-3.5 text-cream-200/80"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-400">
                      <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                    </span>
                    <span>{occasion}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.2}>
              <Link
                href="/catering"
                className={buttonClasses({
                  variant: "outline",
                  size: "lg",
                  className:
                    "mt-9 border-cream-50/30 text-cream-50 hover:bg-cream-50/10",
                })}
              >
                Enquire about catering
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          {/* Image */}
          <Reveal delay={0.1} className="order-first lg:order-last">
            <div className="group relative overflow-hidden rounded-3xl border border-forest-700/60 shadow-warm">
              <Image
                src="/menu/feast.jpg"
                alt="A generous Namche Kitchen catering feast laid out to share"
                width={1200}
                height={1000}
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950/45 via-transparent to-transparent"
                aria-hidden
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

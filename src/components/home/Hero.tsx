import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Clock, Flame } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { OrderButton } from "@/components/site/OrderButton";
import { OpenStatus } from "@/components/site/OpenStatus";
import { Reveal } from "@/components/motion/Reveal";
import { DoodleScatter } from "@/components/decor/DoodleScatter";
import { SITE } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-cream-50">
      <DoodleScatter preset="rich" />
      {/* Ambient background shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-forest-100/60 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full bg-gold-300/10 blur-3xl" />
      </div>

      <Container className="relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-8 lg:py-28">
        {/* LEFT — copy */}
        <div className="flex flex-col items-start gap-6">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-forest-400">
              Ottawa&apos;s Himalayan Kitchen
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tight text-forest-900 sm:text-6xl lg:text-[4.5rem]">
              Momos,
              <br />
              masala &amp; more.
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="max-w-md text-pretty text-lg leading-relaxed text-forest-500">
              Hand-pleated dumplings, aromatic curries and halal shawarma —
              made fresh every day and served with Himalayan warmth.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="w-full">
            <div className="flex w-full max-w-md flex-col gap-3 rounded-xl border border-cream-200 bg-white/80 p-3 backdrop-blur-sm sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-2.5 px-2 py-1">
                <MapPin className="h-4 w-4 shrink-0 text-forest-400" />
                <div className="leading-tight">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-forest-400">
                    Pickup &amp; delivery
                  </p>
                  <p className="text-sm font-medium text-forest-800">
                    {SITE.address.line2}
                  </p>
                </div>
              </div>
              <OrderButton
                variant="forest"
                size="lg"
                label="Order Online"
                className="w-full sm:w-auto"
              />
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-forest-500">
              <Link
                href="/reservations"
                className="font-medium text-forest-800 underline-offset-4 hover:underline"
              >
                Book a table &rarr;
              </Link>
              <span className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                Loved across Ottawa
              </span>
              <OpenStatus variant="pill" />
            </div>
          </Reveal>
        </div>

        {/* RIGHT — cinematic momo image */}
        <Reveal delay={0.12} className="relative mx-auto w-full max-w-lg lg:max-w-xl">
          {/* Glow disc behind plate */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[85%] w-[85%] rounded-full bg-forest-100/50 blur-2xl" />
          </div>

          {/* Floating badges */}
          <div className="pointer-events-none absolute left-0 top-8 z-10 hidden sm:block">
            <div className="flex items-center gap-2 rounded-full border border-cream-200 bg-white/90 px-3 py-1.5 shadow-subtle backdrop-blur-sm">
              <Flame className="h-3.5 w-3.5 text-forest-500" />
              <span className="text-xs font-medium text-forest-700">Made Fresh Daily</span>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-2 bottom-16 z-10 hidden sm:block">
            <div className="flex items-center gap-2 rounded-full border border-cream-200 bg-white/90 px-3 py-1.5 shadow-subtle backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
              <span className="text-xs font-medium text-forest-700">4.8 Rating</span>
            </div>
          </div>

          <div className="pointer-events-none absolute right-4 top-0 z-10 hidden sm:block">
            <div className="flex items-center gap-2 rounded-full border border-cream-200 bg-white/90 px-3 py-1.5 shadow-subtle backdrop-blur-sm">
              <Clock className="h-3.5 w-3.5 text-forest-500" />
              <span className="text-xs font-medium text-forest-700">Open Now</span>
            </div>
          </div>

          {/* Main momo image — slow rotating plate */}
          <div className="relative aspect-square w-full animate-spin-slow">
            <Image
              src="/Food Images ( websire/Main Home Page Momo.png"
              alt="Hand-pleated Himalayan momos served on a ceramic plate"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-contain drop-shadow-2xl"
              unoptimized
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

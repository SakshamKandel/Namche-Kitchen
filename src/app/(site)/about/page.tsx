import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Heart,
  Leaf,
  Flame,
  ShieldCheck,
  Users,
  ChefHat,
  UtensilsCrossed,
  Soup,
  Salad,
  Sandwich,
  ArrowRight,
  Instagram,
  Facebook,
  Mountain,
  Quote,
} from "lucide-react";

import { SITE } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { buttonClasses } from "@/components/ui/Button";
import { OrderButton } from "@/components/site/OrderButton";
import { DoodleScatter } from "@/components/decor/DoodleScatter";
import { Doodle, type DoodleName } from "@/components/decor/FoodDoodles";

export const metadata: Metadata = {
  title: `Our Story — ${SITE.name}`,
  description: `The story behind Namche Kitchen — Himalayan roots, made-fresh food, and a community table in Ottawa. Learn about our momo, shawarma, curries and more.`,
};

/* ------------------------------------------------------------------ */
/*  Cards & rows                                                       */
/* ------------------------------------------------------------------ */
function ValueCard({
  index,
  icon: Icon,
  heading,
  body,
}: {
  index: number;
  icon: React.ElementType;
  heading: string;
  body: string;
}) {
  return (
    <article className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-sand-300 bg-cream-50 p-7 shadow-warm transition-all duration-300 hover:-translate-y-1">
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-clay-500 transition-transform duration-300 group-hover:scale-x-100" />
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-800 text-cream-50 transition-colors duration-300 group-hover:bg-clay-500 group-hover:text-cream-50">
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <span className="font-display text-2xl font-medium text-sand-300 transition-colors duration-300 group-hover:text-clay-500">
          {String(index).padStart(2, "0")}
        </span>
      </div>
      <h3 className="font-display text-lg font-semibold text-forest-900">
        {heading}
      </h3>
      <p className="text-sm leading-relaxed text-forest-600">{body}</p>
    </article>
  );
}

function CuisinePanel({
  label,
  icon: Icon,
  title,
  blurb,
  items,
  doodle,
}: {
  label: string;
  icon: React.ElementType;
  title: string;
  blurb: string;
  items: {
    icon: React.ElementType;
    name: string;
    body: string;
    tag?: string;
  }[];
  doodle?: DoodleName;
}) {
  return (
    <div className="relative isolate flex h-full flex-col gap-6 overflow-hidden rounded-3xl border border-sand-300 bg-cream-50 p-7 shadow-warm sm:p-9">
      {doodle && (
        <Doodle
          name={doodle}
          className="pointer-events-none absolute -right-3 -top-3 -z-10 h-20 w-20 text-sand-200"
        />
      )}
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-clay-500/12 text-clay-500">
          <Icon className="h-5 w-5" strokeWidth={1.7} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-clay-500">
            {label}
          </p>
          <h3 className="font-display text-xl font-semibold text-forest-900">
            {title}
          </h3>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-forest-600">{blurb}</p>
      <ul className="-my-1 flex flex-col divide-y divide-sand-300">
        {items.map((it) => (
          <li key={it.name} className="flex items-start gap-3.5 py-3.5">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sand-100 text-forest-600">
              <it.icon className="h-4 w-4" strokeWidth={1.7} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-forest-900">
                  {it.name}
                </span>
                {it.tag && (
                  <span className="rounded-full bg-gold-400/20 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-gold-600">
                    {it.tag}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-forest-600">
                {it.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatItem({
  value,
  label,
  suffix,
}: {
  value: string;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="font-display text-5xl font-medium text-cream-50 sm:text-6xl">
        {value}
        {suffix && (
          <span className="text-2xl font-normal text-gold-400">{suffix}</span>
        )}
      </span>
      <span className="mt-2 max-w-[14rem] text-sm leading-relaxed text-cream-200/75">
        {label}
      </span>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-800 text-cream-50">
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-clay-500">
          {label}
        </p>
        <div className="mt-0.5 text-sm text-forest-700">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function AboutPage() {
  return (
    <>
      {/* ── Hero (warm cinematic — Everest + prayer flags) ─────────── */}
      <section className="relative isolate overflow-hidden bg-forest-950">
        {/* Full-bleed mountain photograph */}
        <div className="absolute inset-0">
          <Image
            src="/ambiance/mountains.jpg"
            alt="The Himalayas above Namche Bazaar, strung with Tibetan prayer flags"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Warm forest gradient wash for legible copy */}
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/85 to-forest-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-forest-950/50" />
          <div className="absolute inset-0 bg-grain opacity-60" />
        </div>

        <Container className="relative pb-20 pt-20 sm:pb-32 sm:pt-36">
          <div className="flex max-w-2xl flex-col items-start gap-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-cream-50/15 bg-cream-50/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-gold-400 backdrop-blur-sm">
                <Mountain className="h-3.5 w-3.5 text-gold-400" />
                Our Story
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-cream-50 sm:text-5xl lg:text-[3.75rem]">
                From the gateway
                <br />
                to Everest
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-lg text-pretty text-lg leading-relaxed text-cream-200/80">
                Namche Bazaar sits at 3,440&nbsp;m — the last great stop before
                the Himalayas rise into cloud. Our kitchen carries that same
                spirit: a warm refuge, honest food, and a door always open.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/menu"
                  className={buttonClasses({ variant: "gold", size: "lg" })}
                >
                  Explore Menu
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/reservations"
                  className={buttonClasses({
                    variant: "outline",
                    size: "lg",
                    className:
                      "border-cream-50/20 text-cream-50 hover:bg-cream-50/10",
                  })}
                >
                  Book a Table
                </Link>
              </div>
            </Reveal>

            {/* Grounded facts strip (static, no glow / no ping) */}
            <Reveal delay={0.2}>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-cream-50/15 bg-forest-900/60 px-3.5 py-1.5 text-xs font-medium text-cream-50 backdrop-blur-sm">
                  <Flame className="h-3.5 w-3.5 text-gold-400" />
                  Made Fresh Daily
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-cream-50/15 bg-forest-900/60 px-3.5 py-1.5 text-xs font-medium text-cream-50 backdrop-blur-sm">
                  <Mountain className="h-3.5 w-3.5 text-gold-400" />
                  3,440&nbsp;m
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-cream-50/15 bg-forest-900/60 px-3.5 py-1.5 text-xs font-medium text-cream-50 backdrop-blur-sm">
                  <ShieldCheck className="h-3.5 w-3.5 text-gold-400" />
                  Halal Certified
                </span>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── Roots / story ──────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-paper py-20 sm:py-28">
        <DoodleScatter preset="soft" />

        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-16">
            {/* Left — story timeline */}
            <div className="flex flex-col gap-8">
              <Reveal>
                <SectionHeading
                  eyebrow="Himalayan roots"
                  title="Where the mountains meet the table"
                />
              </Reveal>

              {/* Framed story photo — hands folding momo */}
              <Reveal delay={0.02}>
                <figure className="group relative overflow-hidden rounded-3xl border border-sand-300 shadow-warm">
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src="/ambiance/hands-momo.jpg"
                      alt="Hands pleating fresh momo dumplings in the Namche Kitchen"
                      fill
                      sizes="(max-width: 1024px) 100vw, 620px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="absolute bottom-3 left-3 rounded-full border border-cream-50/15 bg-forest-950/70 px-3 py-1 text-[0.7rem] font-medium text-cream-50 backdrop-blur-sm">
                    Every momo folded by hand
                  </figcaption>
                </figure>
              </Reveal>

              {/* Journey — three chapters, side by side */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Step 1 — The Origin */}
                <Reveal delay={0.04}>
                  <div className="flex h-full flex-col gap-3 rounded-3xl border border-sand-300 bg-cream-50 p-6 shadow-warm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-sand-300 bg-sand-100 text-forest-700">
                        <Mountain className="h-4 w-4" strokeWidth={1.8} />
                      </div>
                      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-clay-500">
                        Step 1
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-forest-900">
                      The Origin
                    </h3>
                    <p className="text-sm leading-relaxed text-forest-600">
                      Namche Bazaar — the legendary trading hub perched at
                      3,440&nbsp;m in the Khumbu Valley of Nepal. A crossroads
                      where mountaineers, traders and Sherpa families gather to
                      rest and share food before the climb to Everest.
                    </p>
                  </div>
                </Reveal>

                {/* Step 2 — Family Tradition */}
                <Reveal delay={0.08}>
                  <div className="flex h-full flex-col gap-3 rounded-3xl border border-sand-300 bg-cream-50 p-6 shadow-warm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-gold-300 bg-sand-100 text-forest-800">
                        <Heart className="h-4 w-4" strokeWidth={1.8} />
                      </div>
                      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-clay-500">
                        Step 2
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-forest-900">
                      Family Tradition
                    </h3>
                    <p className="text-sm leading-relaxed text-forest-600">
                      Recipes travel directly from family kitchens in the hills
                      of Nepal: hand-folded momo, aromatic curries and stir-fried
                      chowmein — each dish carrying its own story of elevation
                      and tradition.
                    </p>
                  </div>
                </Reveal>

                {/* Step 3 — Ottawa Welcome */}
                <Reveal delay={0.12}>
                  <div className="flex h-full flex-col gap-3 rounded-3xl border border-sand-300 bg-cream-50 p-6 shadow-warm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-sand-300 bg-sand-100 text-forest-700">
                        <MapPin className="h-4 w-4" strokeWidth={1.8} />
                      </div>
                      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-clay-500">
                        Step 3
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-forest-900">
                      Ottawa Welcome
                    </h3>
                    <p className="text-sm leading-relaxed text-forest-600">
                      We opened Namche Kitchen to bring that same welcome to
                      Ottawa — a place where every guest is invited to slow down,
                      eat well and feel at home, whatever the journey ahead.
                    </p>
                  </div>
                </Reveal>
              </div>

              {/* Pull quote */}
              <Reveal delay={0.16}>
                <blockquote className="relative rounded-2xl border border-sand-300 bg-sand-100 p-6 shadow-warm">
                  <Quote className="absolute -left-2 -top-3 h-8 w-8 text-clay-400/50" />
                  <p className="text-pretty text-sm font-medium italic leading-relaxed text-forest-700">
                    &ldquo;The Himalayan tradition has always been one of
                    openness: pull up a chair, pour some tea, share a
                    meal.&rdquo;
                  </p>
                </blockquote>
              </Reveal>

              {/* Tags */}
              <Reveal delay={0.2}>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-100 px-3 py-1.5 text-xs font-medium text-forest-700">
                    <Heart className="h-3.5 w-3.5 text-clay-500" />
                    Family Recipes
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-100 px-3 py-1.5 text-xs font-medium text-forest-700">
                    <ShieldCheck className="h-3.5 w-3.5 text-clay-500" />
                    Halal Certified
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-100 px-3 py-1.5 text-xs font-medium text-forest-700">
                    <Leaf className="h-3.5 w-3.5 text-clay-500" />
                    Local Sourcing
                  </span>
                </div>
              </Reveal>
            </div>

            {/* Right — sticky altitude card */}
            <Reveal delay={0.08}>
              <div className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-sand-300 bg-sand-100 p-7 shadow-warm lg:sticky lg:top-28">
                {/* Decorative mountain doodle */}
                <Doodle
                  name="mountain"
                  className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 text-sand-300"
                />

                <div className="relative">
                  <span className="font-display block text-6xl font-medium leading-none text-forest-900 sm:text-7xl">
                    3,440
                    <span className="text-2xl font-normal text-clay-500 sm:text-3xl">
                      {" "}
                      m
                    </span>
                  </span>
                  <p className="mt-2 text-sm text-forest-600">
                    Altitude of Namche Bazaar — gateway to Everest
                  </p>
                </div>

                <hr className="border-sand-300" />

                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl bg-cream-50 p-4 transition-colors hover:bg-cream-100">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-800 text-cream-50">
                      <ChefHat className="h-4 w-4" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-forest-900">
                        Hand-folded daily
                      </p>
                      <p className="text-xs text-forest-600">
                        Every momo pleated in-house
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-cream-50 p-4 transition-colors hover:bg-cream-100">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-800 text-cream-50">
                      <Heart className="h-4 w-4" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-forest-900">
                        Sherpa hospitality
                      </p>
                      <p className="text-xs text-forest-600">
                        Warm tea and warm welcomes
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm italic leading-relaxed text-forest-600">
                  &ldquo;From that height, everything tastes a little more
                  earned — and a lot more satisfying.&rdquo;
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── Core values ────────────────────────────────────────────── */}
      <section className="relative isolate bg-cream-100 py-20 sm:py-28">
        <DoodleScatter preset="soft" />
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="What drives us"
              title="Our core values"
              description="The principles that shape every dish we make and every guest we welcome."
              align="center"
              className="mb-14"
            />
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Heart,
                heading: "Made with care",
                body: "We treat every plate as if it were for our own family. Attention to detail is not optional — it is the recipe.",
              },
              {
                icon: ShieldCheck,
                heading: "Halal integrity",
                body: "Our entire meat menu is Halal-certified, sourced from trusted suppliers, and prepared with full respect.",
              },
              {
                icon: Leaf,
                heading: "Fresh & local",
                body: "Produce comes from local farms where possible. Spices are selected for quality. Nothing is pre-packed.",
              },
              {
                icon: Users,
                heading: "Community first",
                body: "We are a gathering place for families, teams, students and neighbours. Everyone leaves feeling like they belong.",
              },
            ].map((v, i) => (
              <Reveal key={v.heading} delay={i * 0.08}>
                <ValueCard index={i + 1} {...v} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Manifesto + stats (the one dark band) ──────────────────── */}
      <section className="relative isolate overflow-hidden bg-forest-950">
        <DoodleScatter preset="band" />
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-60" />

        <Container className="relative py-16 sm:py-28">
          <Reveal>
            <blockquote className="mx-auto max-w-3xl text-center">
              <Quote className="mx-auto mb-6 h-8 w-8 text-gold-400/70" />
              <p className="text-balance font-display text-2xl font-semibold leading-snug text-cream-50 sm:text-3xl md:text-[2.5rem]">
                Every bowl, every dumpling, every plate leaves this kitchen the
                same way — made fresh, made with care, made to nourish.
              </p>
              <footer className="mt-8 flex items-center justify-center gap-3">
                <span className="inline-block h-px w-8 bg-gold-400/50" />
                <span className="text-sm font-medium uppercase tracking-[0.25em] text-gold-400">
                  The Namche Kitchen family
                </span>
                <span className="inline-block h-px w-8 bg-gold-400/50" />
              </footer>
            </blockquote>
          </Reveal>

          <div className="mx-auto mt-16 max-w-4xl border-t border-cream-50/10 pt-14">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  value: "3,440",
                  label: "Metres above sea level — our namesake",
                  suffix: "m",
                },
                {
                  value: "100",
                  label: "Percent Halal-certified meat menu",
                  suffix: "%",
                },
                { value: "Daily", label: "Fresh momo dough, rolled by hand" },
                { value: "7", label: "Days a week, open in Ottawa", suffix: "/7" },
              ].map((s, i) => (
                <Reveal key={s.label} delay={i * 0.06}>
                  <StatItem value={s.value} label={s.label} suffix={s.suffix} />
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Two cuisines, one kitchen ──────────────────────────────── */}
      <section className="relative isolate bg-paper py-20 sm:py-28">
        <DoodleScatter preset="soft" />
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="On the menu"
              title="Two cuisines, one kitchen"
              description="We bring together the Himalayan traditions of Nepal with the rich flavours of Halal Middle-Eastern cooking — a pairing born from the same love of fresh ingredients and bold spice."
              align="center"
              className="mb-14"
            />
          </Reveal>

          {/* Paired dish photos */}
          <div className="mb-10 grid gap-6 sm:grid-cols-2">
            <Reveal>
              <figure className="group relative overflow-hidden rounded-3xl border border-sand-300 shadow-warm">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src="/menu/momo-steam.jpg"
                    alt="Steamed Himalayan momo dumplings"
                    fill
                    sizes="(max-width: 640px) 100vw, 560px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="absolute bottom-3 left-3 rounded-full border border-cream-50/15 bg-forest-950/70 px-3 py-1 text-[0.7rem] font-medium text-cream-50 backdrop-blur-sm">
                  Steamed momo, Nepali style
                </figcaption>
              </figure>
            </Reveal>
            <Reveal delay={0.06}>
              <figure className="group relative overflow-hidden rounded-3xl border border-sand-300 shadow-warm">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src="/menu/shawarma-wrap.jpg"
                    alt="Freshly wrapped Halal shawarma"
                    fill
                    sizes="(max-width: 640px) 100vw, 560px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="absolute bottom-3 left-3 rounded-full border border-cream-50/15 bg-forest-950/70 px-3 py-1 text-[0.7rem] font-medium text-cream-50 backdrop-blur-sm">
                  Halal shawarma, wrapped fresh
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <CuisinePanel
                label="From the hills of Nepal"
                icon={Mountain}
                title="Himalayan"
                doodle="momo"
                blurb="Recipes carried straight from family kitchens — hand-folded, slow-cooked and full of warmth."
                items={[
                  {
                    icon: UtensilsCrossed,
                    name: "Momo",
                    body: "Hand-pleated dumplings, steamed or fried, filled with spiced chicken, pork or vegetables.",
                    tag: "Most Loved",
                  },
                  {
                    icon: Soup,
                    name: "Chowmein & Noodles",
                    body: "Wok-tossed egg noodles with crisp vegetables and your choice of protein.",
                  },
                  {
                    icon: ChefHat,
                    name: "Curries & Dal",
                    body: "Rich, slow-cooked curries and lentil dal seasoned with fresh spices.",
                  },
                  {
                    icon: Salad,
                    name: "Sides & Chutneys",
                    body: "Crispy papads, cucumber salads and house chutneys that lift every plate.",
                  },
                ]}
              />
            </Reveal>

            <Reveal delay={0.08}>
              <CuisinePanel
                label="Halal Middle-Eastern"
                icon={Flame}
                title="Flame & Spice"
                doodle="chilli"
                blurb="Marinated, slow-roasted and wrapped fresh — every meat dish on our menu is Halal-certified."
                items={[
                  {
                    icon: Flame,
                    name: "Shawarma",
                    body: "Chicken or beef, slow-roasted on the spit and wrapped with garlic sauce and pickles.",
                    tag: "Halal",
                  },
                  {
                    icon: Sandwich,
                    name: "Wraps & Plates",
                    body: "Generous rice plates and warm-bread wraps, built to order and full of flavour.",
                  },
                  {
                    icon: Leaf,
                    name: "Vegetarian & Vegan",
                    body: "A wide, clearly-marked plant-based selection so every guest eats well.",
                    tag: "Plant Based",
                  },
                ]}
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── Philosophy / made fresh ────────────────────────────────── */}
      <section className="relative isolate bg-cream-100 py-20 sm:py-28">
        <DoodleScatter preset="soft" />
        <Container size="narrow">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
            <Reveal>
              <SectionHeading
                eyebrow="Our philosophy"
                title="Made fresh, every day"
              />
              {/* Editorial kitchen photo */}
              <div className="group relative mt-6 overflow-hidden rounded-3xl border border-sand-300 shadow-warm">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src="/ambiance/kitchen.jpg"
                    alt="A chef cooking over the flame in the Namche Kitchen"
                    fill
                    sizes="(max-width: 1024px) 100vw, 520px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-4">
                <p className="text-base leading-relaxed text-forest-700">
                  Nothing at Namche Kitchen is pre-packed or reheated. We
                  believe the ritual of making food from scratch is itself a
                  form of hospitality — a promise that what lands on your plate
                  was prepared with attention, not shortcuts.
                </p>
                <p className="text-base leading-relaxed text-forest-700">
                  That commitment extends to our sourcing: local produce where
                  possible, Halal-certified proteins throughout, and spices
                  selected for quality, not convenience.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <ul className="flex flex-col gap-3">
                {[
                  {
                    icon: ChefHat,
                    label: "Dough rolled fresh each morning",
                    sub: "Every momo pleated in-house before service",
                  },
                  {
                    icon: Soup,
                    label: "Curries simmered slowly through the day",
                    sub: "Depth of flavour you can only earn with time",
                  },
                  {
                    icon: Flame,
                    label: "Shawarma carved to order",
                    sub: "Basted on the spit and sliced when you order",
                  },
                  {
                    icon: ShieldCheck,
                    label: "Halal certified, end to end",
                    sub: "Trusted suppliers across the whole menu",
                  },
                ].map((row) => (
                  <li
                    key={row.label}
                    className="flex items-start gap-4 rounded-2xl border border-sand-300 bg-cream-50 p-5 shadow-warm transition-all duration-300 hover:-translate-y-1"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-clay-500/12 text-clay-500">
                      <row.icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold leading-snug text-forest-900">
                        {row.label}
                      </p>
                      <p className="mt-0.5 text-xs text-forest-600">
                        {row.sub}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── Community ──────────────────────────────────────────────── */}
      <section className="relative isolate bg-paper py-20 sm:py-28">
        <DoodleScatter preset="soft" />
        <Container size="narrow">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
            <Reveal>
              <SectionHeading
                eyebrow="Community"
                title="A table for everyone"
                description={`${SITE.name} is more than a restaurant — it is a gathering place. We welcome families, solo diners, office teams and new Ottawans alike. The Himalayan tradition has always been one of openness: pull up a chair, pour some tea, share a meal.`}
              />
              {/* Rustic set table photo */}
              <div className="group relative mt-6 overflow-hidden rounded-3xl border border-sand-300 shadow-warm">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src="/ambiance/table.jpg"
                    alt="A rustic table set and ready for guests"
                    fill
                    sizes="(max-width: 1024px) 100vw, 520px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              </div>
              <p className="mt-6 text-base leading-relaxed text-forest-700">
                Whether you are celebrating a milestone, grabbing a quick
                weekday lunch or discovering Himalayan food for the first time,
                there is a place for you here. That is what the spirit of Namche
                has always meant.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2">
                {[
                  { num: "Families", text: "Kid-friendly meals and high chairs ready" },
                  { num: "Teams", text: "Group orders and catering available" },
                  { num: "Students", text: "Hearty portions at honest prices" },
                  { num: "Newcomers", text: "First-timers guided with a smile" },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="flex flex-col gap-1 rounded-2xl border border-sand-300 bg-cream-50 p-5 shadow-warm transition-all duration-300 hover:-translate-y-1"
                  >
                    <span className="font-display text-xl font-medium text-forest-900">
                      {item.num}
                    </span>
                    <span className="text-sm text-forest-600">{item.text}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── Visit us ───────────────────────────────────────────────── */}
      <section className="relative isolate bg-cream-100 py-20 sm:py-28">
        <DoodleScatter preset="soft" />
        <Container size="narrow">
          <Reveal>
            <SectionHeading
              eyebrow="Visit us"
              title="Come find us in Ottawa"
              align="center"
              className="mb-14"
            />
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal delay={0.06}>
              <div className="flex h-full flex-col gap-6 rounded-3xl border border-sand-300 bg-cream-50 p-7 shadow-warm">
                <h3 className="font-display text-xl font-semibold text-forest-900">
                  Location & Contact
                </h3>
                <div className="flex flex-col gap-5">
                  <InfoRow icon={MapPin} label="Address">
                    <a
                      href={SITE.address.mapHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-forest-900 hover:underline"
                    >
                      {SITE.address.line1}
                      <br />
                      {SITE.address.line2}
                    </a>
                  </InfoRow>
                  <InfoRow icon={Phone} label="Phone">
                    <a
                      href={SITE.phoneHref}
                      className="hover:text-forest-900 hover:underline"
                    >
                      {SITE.phone}
                    </a>
                  </InfoRow>
                  <InfoRow icon={Mail} label="Email">
                    <a
                      href={`mailto:${SITE.email}`}
                      className="hover:text-forest-900 hover:underline"
                    >
                      {SITE.email}
                    </a>
                  </InfoRow>
                </div>
                <div className="mt-auto flex gap-2 pt-2">
                  <a
                    href={SITE.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-sand-300 text-forest-600 transition-colors hover:bg-clay-500 hover:text-cream-50"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href={SITE.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-sand-300 text-forest-600 transition-colors hover:bg-clay-500 hover:text-cream-50"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="flex h-full flex-col gap-6 rounded-3xl border border-sand-300 bg-cream-50 p-7 shadow-warm">
                <h3 className="font-display text-xl font-semibold text-forest-900">
                  Opening Hours
                </h3>
                <div className="flex flex-col gap-4">
                  {SITE.hours.map((h) => (
                    <div key={h.days} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-800 text-cream-50">
                        <Clock className="h-4 w-4" strokeWidth={1.8} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-forest-900">
                          {h.days}
                        </p>
                        <p className="text-sm text-forest-600">{h.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-2">
                  <OrderButton size="md" className="w-full" />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-forest-900">
        <DoodleScatter preset="band" />
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-50" />
        <Container size="narrow" className="relative py-16 sm:py-28">
          <Reveal>
            <div className="flex flex-col items-center gap-6 text-center">
              <SectionHeading
                title="Come hungry. Leave happy."
                description={`Explore our full menu or book a table — we cannot wait to welcome you to ${SITE.name}.`}
                align="center"
                tone="cream"
              />
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/menu"
                  className={buttonClasses({ variant: "cream", size: "lg" })}
                >
                  View the menu
                </Link>
                <Link
                  href="/reservations"
                  className={buttonClasses({
                    variant: "outline",
                    size: "lg",
                    className:
                      "border-cream-50/20 text-cream-50 hover:bg-cream-50/10",
                  })}
                >
                  Book a table
                </Link>
                <OrderButton size="lg" variant="gold" />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

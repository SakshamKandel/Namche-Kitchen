import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  ChevronRight,
  Zap,
  PhoneCall,
  UsersRound,
} from "lucide-react";
import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ReservationForm } from "@/components/forms/ReservationForm";
import { DoodleScatter } from "@/components/decor/DoodleScatter";
import { OpenStatus } from "@/components/site/OpenStatus";

export const metadata: Metadata = {
  title: `Book a Table — ${SITE.name}`,
  description: `Reserve a table at ${SITE.name} in Calgary. Online booking for up to 12 guests — Himalayan food, warm atmosphere.`,
};

const REASSURANCE = [
  {
    icon: Zap,
    title: "Instant request",
    body: "Send your booking in under a minute — no account needed.",
  },
  {
    icon: PhoneCall,
    title: "We confirm personally",
    body: "Expect a quick call or email to lock in your table.",
  },
  {
    icon: UsersRound,
    title: "Up to 12 guests",
    body: "Hosting more? Our catering team takes it from there.",
  },
];

export default function ReservationsPage() {
  return (
    <div className="relative isolate overflow-hidden py-16 sm:py-24">
      <DoodleScatter preset="soft" />

      <Container size="wide">
        {/* ── Page intro ── */}
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-medium uppercase tracking-widest text-forest-400">
              Reservations
            </span>
            <h1 className="font-display mt-3 text-4xl font-medium tracking-tight text-balance text-forest-900 sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              Book your table
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-forest-500 sm:text-lg">
              Pull up a chair for a warm Himalayan meal. Send a request and
              we&rsquo;ll have everything ready the moment you arrive.
            </p>
            <span
              aria-hidden="true"
              className="mx-auto mt-7 block h-px w-16 bg-gold-400"
            />
          </div>
        </Reveal>

        {/* ── Two-column split: form-first on mobile ── */}
        <div className="mt-14 grid items-start gap-8 lg:mt-16 lg:grid-cols-2 xl:gap-12">
          {/* FORM CARD — first on mobile (order), second on lg */}
          <Reveal delay={0.08} className="lg:order-2">
            <div className="rounded-3xl border border-cream-200 bg-white p-7 shadow-subtle sm:p-9 lg:p-10">
              <div className="mb-7">
                <span className="text-xs font-medium uppercase tracking-widest text-forest-400">
                  Your details
                </span>
                <h2 className="font-display mt-2 text-2xl font-medium tracking-tight text-forest-900">
                  Tell us who&rsquo;s coming
                </h2>
              </div>
              <ReservationForm />
            </div>
          </Reveal>

          {/* FEATURE PANEL — second on mobile, first on lg */}
          <Reveal delay={0.04} className="lg:order-1">
            <div className="relative isolate overflow-hidden rounded-3xl bg-forest-800 p-7 text-cream-50 shadow-subtle sm:p-9 lg:p-10">
              <DoodleScatter preset="band" />

              {/* Warm food image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-cream-50/10">
                <Image
                  src="/menu/curry.jpg"
                  alt="A simmering Himalayan curry served at Namche Kitchen"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                  priority
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-forest-950/40 to-transparent"
                />
              </div>

              {/* Welcome */}
              <div className="mt-7">
                <span className="text-xs font-medium uppercase tracking-widest text-gold-400">
                  Welcome to {SITE.name}
                </span>
                <p className="font-display mt-3 text-xl font-medium leading-snug text-cream-50 text-pretty sm:text-2xl">
                  A calm, candle-warm room and food made with heart — we
                  can&rsquo;t wait to host you.
                </p>
              </div>

              {/* Hours */}
              <div className="mt-8 border-t border-cream-50/10 pt-7">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-gold-400">
                    <Clock className="h-5 w-5 shrink-0" />
                    <span className="text-xs font-medium uppercase tracking-widest">
                      Hours
                    </span>
                  </div>
                  <OpenStatus variant="pill" />
                </div>
                <ul className="flex flex-col gap-3">
                  {SITE.hours.map((row) => (
                    <li
                      key={row.days}
                      className="flex items-baseline justify-between gap-4 border-b border-cream-50/10 pb-3 text-sm last:border-0 last:pb-0"
                    >
                      <span className="text-cream-200/70">{row.days}</span>
                      <span className="font-semibold text-cream-50">
                        {row.time}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Address + Phone */}
              <div className="mt-7 grid gap-7 border-t border-cream-50/10 pt-7 sm:grid-cols-2">
                {/* Address */}
                <div>
                  <div className="mb-3 flex items-center gap-2.5 text-gold-400">
                    <MapPin className="h-5 w-5 shrink-0" />
                    <span className="text-xs font-medium uppercase tracking-widest">
                      Find us
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-cream-50">
                    {SITE.address.line1}
                    <br />
                    {SITE.address.line2}
                  </p>
                  <a
                    href={SITE.address.mapHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-gold-400 underline underline-offset-4 transition-colors hover:text-gold-300"
                  >
                    Open in Maps
                    <ChevronRight className="h-3.5 w-3.5" />
                  </a>
                </div>

                {/* Phone */}
                <div>
                  <div className="mb-3 flex items-center gap-2.5 text-gold-400">
                    <Phone className="h-5 w-5 shrink-0" />
                    <span className="text-xs font-medium uppercase tracking-widest">
                      Call us
                    </span>
                  </div>
                  <a
                    href={SITE.phoneHref}
                    className="font-display text-2xl font-medium text-cream-50 transition-colors hover:text-gold-300"
                  >
                    {SITE.phone}
                  </a>
                  <p className="mt-1 text-sm text-cream-200/60">
                    Best for same-day bookings.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Reassurance row ── */}
        <Reveal delay={0.05}>
          <ul className="mt-12 grid gap-4 sm:grid-cols-3 lg:mt-14">
            {REASSURANCE.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                className="flex items-start gap-4 rounded-2xl border border-cream-200 bg-cream-50/60 p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-700">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-forest-900">
                    {title}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-forest-500">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* ── Large-group / catering callout ── */}
        <Reveal delay={0.08}>
          <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-cream-300 bg-cream-100 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <p className="text-sm leading-relaxed text-forest-800 sm:max-w-2xl">
              <span className="font-semibold">
                Hosting 8+ guests or planning an event?
              </span>{" "}
              Our catering team can arrange platters, trays and full-service
              menus tailored to your occasion.
            </p>
            <Link
              href="/catering"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-forest-700 underline underline-offset-4 transition-colors hover:text-forest-900"
            >
              Explore catering
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}

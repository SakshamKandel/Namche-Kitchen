import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonClasses } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { CateringForm } from "@/components/forms/CateringForm";
import { DoodleScatter } from "@/components/decor/DoodleScatter";
import { Doodle, type DoodleName } from "@/components/decor/FoodDoodles";
import { HeroCollage } from "@/components/catering/HeroCollage";
import { TastingBoard } from "@/components/catering/TastingBoard";

export const metadata: Metadata = {
  title: `Catering — ${SITE.name}`,
  description: `Namche Kitchen catering for birthdays, corporate lunches, weddings and festivals in Ottawa. Authentic Himalayan and Halal Middle-Eastern food for groups of 10 to 500+.`,
};

const STEPS: { title: string; body: string }[] = [
  {
    title: "Tell us about your event",
    body: "Share your date, guest count and the vibe you're after. A two-minute enquiry is all it takes to get started.",
  },
  {
    title: "We craft a custom proposal",
    body: "Our kitchen designs a menu around your tastes, dietary needs and budget — with clear, friendly pricing.",
  },
  {
    title: "We cook & deliver, you relax",
    body: "Everything arrives fresh and ready to serve. Enjoy your day while we handle the food.",
  },
];

const OFFERINGS: { doodle: DoodleName; title: string; body: string }[] = [
  {
    doodle: "momo",
    title: "Family Platters",
    body: "Generous trays of momo, chowmein, curries and sides — perfect for intimate gatherings and family celebrations.",
  },
  {
    doodle: "tea",
    title: "Office Lunches",
    body: "Individually boxed or shared-platter options that keep your team fuelled without the fuss.",
  },
  {
    doodle: "samosa",
    title: "Event Trays",
    body: "Large-format trays of our most-loved dishes, ready to serve at weddings, festivals and community events.",
  },
  {
    doodle: "mountain",
    title: "Custom Himalayan Menus",
    body: "Work with our kitchen to design a custom spread — Halal Middle-Eastern selections, vegetarian feasts, or the full Namche experience.",
  },
];

const STATS: { value: string; label: string }[] = [
  { value: "10 – 500+", label: "Guests" },
  { value: "7 days", label: "Notice needed" },
  { value: "Fully custom", label: "Menus" },
  { value: "100% Halal", label: "Kitchen" },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "How much notice do you need?",
    a: "We ask for at least 7 days' notice so we can source the freshest ingredients and plan our kitchen. For larger events, the earlier the better — reach out and we'll do our best to accommodate.",
  },
  {
    q: "Can you cater dietary requirements?",
    a: "Absolutely. Our entire kitchen is 100% Halal, and we offer vegetarian, vegan and customisable spreads. Just let us know in your enquiry and we'll tailor the menu.",
  },
  {
    q: "Do you deliver across Ottawa?",
    a: "Yes — we deliver and set up across the Ottawa area. Delivery details and any travel costs are confirmed in your custom proposal.",
  },
];

/** Small warm eyebrow for light surfaces — terracotta, wide-tracked. */
function ClayEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-clay-500">
      {children}
    </span>
  );
}

export default function CateringPage() {
  return (
    <>
      {/* ── 1. Hero — one cinematic dark band ── */}
      <section className="relative isolate overflow-hidden bg-forest-950 bg-grain">
        <DoodleScatter preset="band" />
        <Container
          size="wide"
          className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-28"
        >
          {/* LEFT — copy */}
          <div className="flex flex-col items-start gap-6">
            <Reveal>
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-gold-400">
                Catering
              </span>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-cream-50 sm:text-5xl lg:text-6xl">
                Himalayan feasts,
                <br />
                brought to your event
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="max-w-md text-pretty text-lg leading-relaxed text-cream-200/80">
                From intimate birthday lunches to large wedding receptions, we
                bring the warmth of Namche Kitchen — fresh momo, aromatic
                curries and Halal favourites — to your celebration in Ottawa.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#enquiry"
                  className={buttonClasses({ variant: "gold", size: "lg" })}
                >
                  Get a quote
                </a>
                <a
                  href={SITE.phoneHref}
                  className={buttonClasses({
                    variant: "outline",
                    size: "lg",
                    className:
                      "border-cream-50/20 text-cream-50 hover:bg-cream-50/10 hover:border-cream-50/30",
                  })}
                >
                  <Phone className="h-4 w-4" />
                  Call {SITE.phone}
                </a>
              </div>
            </Reveal>
          </div>

          {/* RIGHT — food photo collage */}
          <Reveal delay={0.12} className="w-full">
            <HeroCollage />
          </Reveal>
        </Container>
      </section>

      {/* ── 2. How it works — warm paper ── */}
      <section className="relative isolate bg-cream-50 bg-paper py-16 sm:py-28">
        <DoodleScatter preset="soft" />
        <Container>
          <Reveal>
            <div className="mb-10 flex flex-col items-center gap-3 text-center sm:mb-14">
              <ClayEyebrow>How it works</ClayEyebrow>
              <SectionHeading
                title="Catering made effortless"
                description="Three simple steps from first enquiry to a table full of food your guests will remember."
                align="center"
              />
            </div>
          </Reveal>

          <ol className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 0.08}>
                <div className="flex h-full flex-col gap-4 rounded-2xl border border-sand-300 bg-cream-50 p-7 shadow-warm transition-transform duration-300 hover:-translate-y-1">
                  <span
                    className="font-display text-5xl font-semibold leading-none text-clay-500"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-forest-900">
                    {step.title}
                  </h3>
                  <p className="text-pretty text-sm leading-relaxed text-forest-700/80">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── 3. What we cater — warm sand weave ── */}
      <section className="relative isolate bg-sand-100 bg-weave py-16 sm:py-28">
        <DoodleScatter preset="soft" />
        <Container>
          <Reveal>
            <div className="mb-10 flex flex-col items-center gap-3 text-center sm:mb-14">
              <ClayEyebrow>What we cater</ClayEyebrow>
              <SectionHeading
                title="A spread for every gathering"
                description="Whether you need a quick weekday lunch or a full banquet, our kitchen adapts to your event and dietary needs."
                align="center"
              />
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {OFFERINGS.map((offering, i) => (
              <Reveal key={offering.title} delay={i * 0.07}>
                <article className="group flex h-full flex-col gap-4 rounded-2xl border border-sand-300 bg-cream-50 p-6 shadow-warm transition-transform duration-300 hover:-translate-y-1">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-clay-500/10 text-clay-500 transition-colors duration-300 group-hover:bg-clay-500 group-hover:text-cream-50"
                    aria-hidden="true"
                  >
                    <Doodle name={offering.doodle} className="h-7 w-7" />
                  </span>
                  <h3 className="font-display text-lg font-semibold leading-snug text-forest-900">
                    {offering.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-forest-700/75">
                    {offering.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 4. From our kitchen — tasting board (warm cream) ── */}
      <section className="bg-cream-100 py-16 sm:py-28">
        <Container size="wide">
          <Reveal>
            <div className="mb-10 flex flex-col items-center gap-3 text-center sm:mb-14">
              <ClayEyebrow>From our kitchen</ClayEyebrow>
              <SectionHeading
                title="A taste of the table"
                description="A glimpse of the dishes we love to serve — every tray made fresh, the morning of your event."
                align="center"
              />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <TastingBoard />
          </Reveal>
        </Container>
      </section>

      {/* ── 5. Trust / stats band — the one dark contrast band ── */}
      <section className="relative isolate overflow-hidden bg-forest-950 bg-grain py-16 sm:py-20">
        <DoodleScatter preset="band" />
        <Container>
          <Reveal>
            <p className="mx-auto max-w-2xl text-balance text-center font-display text-2xl font-semibold leading-relaxed text-cream-50 sm:text-3xl">
              &ldquo;Every event is a chance to share the flavours of the
              Himalayas — made fresh, made with care.&rdquo;
            </p>
            <p className="mt-3 text-center text-xs font-medium uppercase tracking-[0.25em] text-gold-400">
              — Namche Kitchen
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl bg-cream-50/10 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-1 bg-forest-950 px-4 py-7 text-center"
                >
                  <span className="font-display text-2xl font-semibold text-cream-50 sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="text-[0.65rem] font-medium uppercase tracking-wider text-cream-200/50">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── 6. Enquiry — warm form card ── */}
      <section
        id="enquiry"
        className="relative isolate scroll-mt-24 bg-cream-50 bg-paper py-16 sm:py-28"
      >
        <DoodleScatter preset="soft" />
        <Container size="narrow">
          <Reveal>
            <div className="mb-12 flex flex-col items-center gap-3 text-center">
              <ClayEyebrow>Get a quote</ClayEyebrow>
              <SectionHeading
                title="Tell us about your event"
                description="Fill in the form and our team will get back to you within one business day with a tailored proposal."
                align="center"
              />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-3xl border border-sand-300 bg-cream-50 p-6 shadow-warm sm:p-10">
              <CateringForm />
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mt-8 text-center text-sm text-forest-600">
              Prefer to talk?{" "}
              <a
                href={SITE.phoneHref}
                className="font-semibold text-clay-600 underline underline-offset-4 hover:text-clay-500"
              >
                Call us at {SITE.phone}
              </a>
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── 7. FAQ — warm sand ── */}
      <section className="bg-sand-100 bg-weave py-16 sm:py-28">
        <Container size="narrow">
          <Reveal>
            <div className="mb-12 flex flex-col items-center gap-3 text-center">
              <ClayEyebrow>Good to know</ClayEyebrow>
              <SectionHeading title="Catering questions, answered" align="center" />
            </div>
          </Reveal>

          <dl className="flex flex-col gap-4">
            {FAQS.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 0.06}>
                <div
                  className={cn(
                    "rounded-2xl border border-sand-300 bg-cream-50 p-6 shadow-warm"
                  )}
                >
                  <dt className="font-display text-lg font-semibold text-forest-900">
                    {faq.q}
                  </dt>
                  <dd className="mt-2 text-pretty text-sm leading-relaxed text-forest-700/80">
                    {faq.a}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>
    </>
  );
}

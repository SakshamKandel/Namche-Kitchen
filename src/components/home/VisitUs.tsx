import Image from "next/image";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { SITE } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { OrderButton } from "@/components/site/OrderButton";
import { Reveal } from "@/components/motion/Reveal";
import { MountainMark } from "@/components/brand/MountainMark";

/**
 * VISIT US — warm-Himalayan-market info band on deep forest, sits directly
 * ABOVE the light MapSection.
 *
 * Editorial two-column layout: a gold eyebrow, mountain mark and Fraunces serif
 * cream headline lead into a stacked detail list with brass icons on warm forest
 * chips, then the Order / Directions / Call CTA row. A tactile ambiance photo
 * panel grounds the right side. All contact info reads from SITE. The intentional
 * dark → light transition into MapSection is by design.
 */
export function VisitUs() {
  const details = [
    {
      icon: MapPin,
      label: "Address",
      value: (
        <>
          {SITE.address.line1}
          <br />
          {SITE.address.line2}
        </>
      ),
    },
    {
      icon: Clock,
      label: "Hours",
      value: (
        <>
          {SITE.hours.map((h) => (
            <span key={h.days} className="block">
              {h.days} · {h.time}
            </span>
          ))}
        </>
      ),
    },
    {
      icon: Phone,
      label: "Phone",
      value: (
        <a
          href={SITE.phoneHref}
          className="transition-colors duration-200 hover:text-gold-400"
        >
          {SITE.phone}
        </a>
      ),
    },
    {
      icon: Mail,
      label: "Email",
      value: (
        <a
          href={`mailto:${SITE.email}`}
          className="break-words transition-colors duration-200 hover:text-gold-400"
        >
          {SITE.email}
        </a>
      ),
    },
  ];

  return (
    <section className="bg-grain bg-forest-950 py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Left — heading, details, CTAs */}
          <div>
            <Reveal>
              <div className="flex flex-col gap-4">
                <span className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
                  <MountainMark tone="cream" className="h-6 w-6" />
                  Find us
                </span>
                <span className="block h-px w-12 bg-gold-400" />
                <h2 className="font-display text-4xl font-medium tracking-tight text-cream-50 sm:text-5xl">
                  Visit us in Ottawa
                </h2>
                <p className="max-w-2xl text-pretty text-base leading-relaxed text-cream-200/75">
                  Dine in, pick up, or just stop by for a cup of masala tea.
                  We&rsquo;re on Wellington St. W, open every day — come find a
                  warm table waiting.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="mt-10 grid gap-x-10 sm:grid-cols-2">
                {details.map((detail) => {
                  const Icon = detail.icon;
                  return (
                    <div
                      key={detail.label}
                      className="flex items-start gap-4 border-t border-cream-200/12 py-6 first:border-t-0 first:pt-0 sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(2)]:pt-0"
                    >
                      <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-800/60 text-gold-400 ring-1 ring-inset ring-gold-400/15">
                        <Icon className="h-5 w-5" strokeWidth={1.6} />
                      </span>
                      <div className="min-w-0">
                        <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                          {detail.label}
                        </dt>
                        <dd className="mt-1.5 text-pretty leading-relaxed text-cream-200/75">
                          {detail.value}
                        </dd>
                      </div>
                    </div>
                  );
                })}
              </dl>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-col gap-3 border-t border-cream-200/12 pt-10 sm:flex-row sm:flex-wrap sm:items-center">
                <OrderButton size="lg" label="Order Online" variant="gold" />
                <a
                  href={SITE.address.mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses({
                    variant: "outline",
                    size: "lg",
                    className:
                      "border-cream-50/30 text-cream-50 hover:bg-cream-50/10 hover:border-cream-50/40",
                  })}
                >
                  <MapPin className="h-[1.05em] w-[1.05em]" />
                  Get directions
                </a>
                <a
                  href={SITE.phoneHref}
                  className={buttonClasses({
                    variant: "ghost",
                    size: "lg",
                    className:
                      "text-cream-100 hover:bg-cream-50/10 hover:text-gold-400",
                  })}
                >
                  <Phone className="h-[1.05em] w-[1.05em]" />
                  Call us
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right — tactile ambiance photo panel */}
          <Reveal delay={0.1} className="lg:pl-4">
            <div className="group relative overflow-hidden rounded-3xl shadow-warm ring-1 ring-inset ring-cream-50/10">
              <Image
                src="/ambiance/table.jpg"
                alt="A warmly lit, rustic set table at Namche Kitchen in Ottawa"
                width={720}
                height={880}
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              {/* Warm cinematic wash for legible caption + cohesion */}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/20 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
                  <span className="block h-px w-6 bg-gold-400" />
                  On Wellington West
                </span>
                <p className="mt-2 font-display text-xl text-cream-50 sm:text-2xl">
                  A warm table, waiting for you
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
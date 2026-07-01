import Link from "next/link";
import { Truck, Bike, UtensilsCrossed, MapPin, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { OrderButton } from "@/components/site/OrderButton";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";

type Partner = {
  name: string;
  href: string;
  icon: typeof Truck;
};

// Owner to supply the real DoorDash / Uber Eats / Skip storefront URLs.
// Until then these point at a safe "#" placeholder.
const PARTNERS: Partner[] = [
  { name: "DoorDash", href: "#", icon: Truck },
  { name: "Uber Eats", href: "#", icon: Bike },
  { name: "Skip The Dishes", href: "#", icon: UtensilsCrossed },
];

/**
 * "Order your way" — a warm strip of order channels. Order Online is the
 * primary, in-house path; DoorDash, Uber Eats and Skip The Dishes round out
 * the third-party delivery options.
 */
export function DeliveryPartners() {
  return (
    <section className="border-y border-sand-300 bg-cream-100 bg-weave py-16 sm:py-20">
      <Container>
        <Reveal>
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
                Order your way
              </p>
              <h2 className="mt-3 font-display text-2xl font-medium tracking-tight text-forest-900 sm:text-3xl">
                Pickup, delivery, or your favourite app
              </h2>
              <p className="mt-3 max-w-md text-sm text-forest-600">
                Hand-folded momo and bold Himalayan flavours, brought straight to
                your door — however you like to order.
              </p>
            </div>
            <OrderButton
              variant="forest"
              size="lg"
              label="Order Online"
              className="shrink-0 shadow-warm"
            />
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Direct ordering, called out first — the warm anchor tile. */}
          <Reveal delay={0.06}>
            <div className="flex h-full items-start gap-4 rounded-2xl border border-clay-500/25 bg-cream-50 bg-paper px-5 py-5 shadow-warm">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-clay-500/10 text-clay-500">
                <UtensilsCrossed className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <span className="text-sm">
                <span className="block font-medium text-forest-900">
                  Order direct
                </span>
                <span className="mt-0.5 block text-forest-600">
                  Best prices, no middleman
                </span>
              </span>
            </div>
          </Reveal>

          {PARTNERS.map((partner, i) => {
            const Icon = partner.icon;
            return (
              <Reveal key={partner.name} delay={0.06 + (i + 1) * 0.05}>
                <Link
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group flex h-full items-center gap-4 rounded-2xl border border-sand-300 bg-cream-50 px-5 py-5",
                    "transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    "hover:-translate-y-1 hover:border-clay-500/30 hover:shadow-warm",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100",
                    "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                  )}
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sand-100 text-clay-500 transition-colors duration-300 group-hover:bg-clay-500/10">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <span className="flex-1 text-sm font-medium text-forest-800 transition-colors duration-300 group-hover:text-forest-900">
                    {partner.name}
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-forest-400 transition-colors duration-300 group-hover:text-clay-500"
                    strokeWidth={1.8}
                  />
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.28}>
          <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-forest-600">
            <MapPin className="h-4 w-4 text-clay-500" strokeWidth={1.8} />
            <span>Pickup &amp; delivery from</span>
            <a
              href={SITE.address.mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-forest-800 underline-offset-4 hover:text-clay-500 hover:underline"
            >
              {SITE.address.line1}, {SITE.address.line2}
            </a>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}

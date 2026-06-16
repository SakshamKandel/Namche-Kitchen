import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { getCategoriesWithItems, getFeaturedItems } from "@/lib/queries";
import { SITE } from "@/lib/constants";

import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { OrderButton } from "@/components/site/OrderButton";
import { Reveal } from "@/components/motion/Reveal";
import { DoodleScatter } from "@/components/decor/DoodleScatter";

import { Hero } from "@/components/home/Hero";
import { CategoryCircles } from "@/components/home/CategoryCircles";
import { DishHighlightCard } from "@/components/home/DishHighlightCard";
import { ScrollRow } from "@/components/home/ScrollRow";
import { CateringTeaser } from "@/components/home/CateringTeaser";
import { Testimonial } from "@/components/home/Testimonial";
import { Faq } from "@/components/home/Faq";
import { MapSection } from "@/components/home/MapSection";

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
};

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    getCategoriesWithItems({ onlyAvailable: true }),
    getFeaturedItems(8),
  ]);

  const featuredIds = new Set(featured.map((f) => f.id));
  const freshPicks = categories
    .map((c) => {
      const item = c.items.find((i) => !featuredIds.has(i.id));
      return item ? { ...item, category: { name: c.name } } : null;
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
    .slice(0, 10);

  const categoryChips = categories.map((c) => ({
    name: c.name,
    slug: c.slug,
    count: c.items.length,
  }));

  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Most loved dishes */}
      {featured.length > 0 && (
        <section className="relative isolate bg-cream-100/50 py-16 sm:py-20">
          <DoodleScatter preset="soft" />
          <Container>
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-forest-400">
                  Crowd favourites
                </p>
                <h2 className="mt-2 font-sans text-2xl font-medium tracking-tight text-forest-900 sm:text-3xl">
                  The dishes everyone orders
                </h2>
              </div>
              <Link
                href="/menu"
                className="hidden shrink-0 text-sm font-medium text-forest-600 underline-offset-4 hover:text-forest-800 hover:underline sm:inline"
              >
                Full menu &rarr;
              </Link>
            </div>
            <ScrollRow ariaLabel="Most loved dishes">
              {featured.map((dish) => (
                <DishHighlightCard key={dish.id} item={dish} />
              ))}
            </ScrollRow>
          </Container>
        </section>
      )}

      {/* 3. Category circles */}
      {categoryChips.length > 0 && (
        <CategoryCircles categories={categoryChips} />
      )}

      {/* 4. Fresh from the kitchen */}
      {freshPicks.length > 0 && (
        <section className="py-16 sm:py-20">
          <Container>
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-forest-400">
                  Fresh from the kitchen
                </p>
                <h2 className="mt-2 font-sans text-2xl font-medium tracking-tight text-forest-900 sm:text-3xl">
                  More to discover
                </h2>
              </div>
              <Link
                href="/menu"
                className="hidden shrink-0 text-sm font-medium text-forest-600 underline-offset-4 hover:text-forest-800 hover:underline sm:inline"
              >
                See it all &rarr;
              </Link>
            </div>
            <ScrollRow ariaLabel="Fresh picks">
              {freshPicks.map((dish) => (
                <DishHighlightCard key={dish.id} item={dish} />
              ))}
            </ScrollRow>
          </Container>
        </section>
      )}

      {/* 5. Testimonial */}
      <Testimonial />

      {/* 6. Catering */}
      <CateringTeaser />

      {/* 7. FAQ */}
      <Faq />

      {/* 9. Map */}
      <MapSection />

      {/* 10. Reserve + Order band */}
      <section className="pb-20 sm:pb-28">
        <Container>
          <Reveal>
            <div className="relative isolate flex flex-col items-start justify-between gap-8 overflow-hidden rounded-xl bg-forest-800 px-8 py-12 sm:px-12 sm:py-14 lg:flex-row lg:items-center">
              <DoodleScatter preset="band" />
              <div className="max-w-xl">
                <h2 className="font-sans text-2xl font-medium tracking-tight text-cream-50 sm:text-3xl">
                  Hungry now? Let&rsquo;s fix that.
                </h2>
                <p className="mt-2 text-base text-cream-200/70">
                  Order online for pickup and delivery, or book a table and dine
                  in with us.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <OrderButton variant="gold" size="lg" label="Order Online" />
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
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

import Link from "next/link";
import type { Metadata } from "next";

import { SITE } from "@/lib/constants";

import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { OrderButton } from "@/components/site/OrderButton";
import { Reveal } from "@/components/motion/Reveal";

import { MountainDivider } from "@/components/decor/MountainDivider";
import { Hero } from "@/components/home/Hero";
import { WhyNamche } from "@/components/home/WhyNamche";
import { SignatureDishes } from "@/components/home/SignatureDishes";
import { MenuPreview } from "@/components/home/MenuPreview";
import { KitchenBand } from "@/components/home/KitchenBand";
import { StorySection } from "@/components/home/StorySection";
import { GalleryStrip } from "@/components/home/GalleryStrip";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { CateringTeaser } from "@/components/home/CateringTeaser";
import { DeliveryPartners } from "@/components/home/DeliveryPartners";
import { Faq } from "@/components/home/Faq";
import { VisitUs } from "@/components/home/VisitUs";
import { MapSection } from "@/components/home/MapSection";

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
};

export default async function HomePage() {
  return (
    <>
      {/* 1. Hero — dark, immersive */}
      <Hero />

      {/* Signature Himalayan ridge transition into the warm sections */}
      <MountainDivider skyClass="bg-forest-950" rangeClass="text-sand-100" />

      {/* 2. Why Namche — slim trust strip */}
      <WhyNamche />

      {/* 3. Signature dishes — large food photography */}
      <SignatureDishes />

      {/* 4. Menu preview — real menu on dark forest */}
      <MenuPreview />

      {/* 4b. Cinematic full-bleed kitchen band */}
      <KitchenBand />

      {/* 5. Our story / Himalayan heritage */}
      <StorySection />

      {/* 6. Gallery — full-bleed food images */}
      <GalleryStrip />

      {/* 7. Reviews — dark forest */}
      <ReviewsSection />

      {/* 8. Catering */}
      <CateringTeaser />

      {/* 9. Delivery partners — order your way */}
      <DeliveryPartners />

      {/* 10. FAQ */}
      <Faq />

      {/* 11. Visit us — info + map (map heading suppressed; VisitUs provides it) */}
      <VisitUs />
      <MapSection showHeading={false} />

      {/* 12. Reserve + Order band — dark forest CTA */}
      <section className="bg-forest-800 py-20 text-cream-100 sm:py-28">
        <Container>
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <span className="block h-px w-12 bg-gold-400" />
                <h2 className="mt-6 font-display text-4xl font-medium tracking-tight text-cream-50 sm:text-5xl">
                  Hungry now? Let&rsquo;s fix that.
                </h2>
                <p className="mt-4 text-cream-200/75">
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
                      "border-cream-50/30 text-cream-50 hover:bg-cream-50/10",
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

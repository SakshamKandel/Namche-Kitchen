import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, ChevronRight } from "lucide-react";
import { SITE } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { DoodleScatter } from "@/components/decor/DoodleScatter";
import { OpenStatus } from "@/components/site/OpenStatus";
import { OrderButton } from "@/components/site/OrderButton";
import { MapSection } from "@/components/home/MapSection";

export const metadata: Metadata = {
  title: `Contact — ${SITE.name}`,
  description: `Get in touch with ${SITE.name} in Ottawa — call ${SITE.phone}, email ${SITE.email}, or visit us at ${SITE.address.line1}, ${SITE.address.line2}.`,
};

export default function ContactPage() {
  return (
    <>
      {/* ── Header ── */}
      <section className="relative isolate bg-forest-800 py-20 sm:py-28">
        <DoodleScatter preset="band" />
        <Container size="narrow">
          <Reveal>
            <SectionHeading
              eyebrow="Contact"
              title="Get in touch"
              description="We invite you to experience the rich flavours and Himalayan vibes of Namche Kitchen. Whether you have a question about our menu or want to book a table, our team is here to help."
              align="center"
              tone="cream"
            />
          </Reveal>
        </Container>
      </section>

      {/* ── Details ── */}
      <section className="relative isolate py-16 sm:py-24">
        <DoodleScatter preset="soft" />
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Phone */}
            <Reveal>
              <a
                href={SITE.phoneHref}
                className="group flex h-full flex-col gap-3 rounded-3xl border border-cream-200 bg-white p-7 shadow-subtle transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-50 text-forest-600">
                  <Phone className="h-5 w-5" />
                </span>
                <span className="text-xs font-medium uppercase tracking-widest text-forest-400">
                  Phone
                </span>
                <span className="font-display text-xl font-semibold text-forest-900 group-hover:text-forest-700">
                  {SITE.phone}
                </span>
                <span className="text-sm text-forest-500">Best for same-day bookings.</span>
              </a>
            </Reveal>

            {/* Email */}
            <Reveal delay={0.06}>
              <a
                href={`mailto:${SITE.email}`}
                className="group flex h-full flex-col gap-3 rounded-3xl border border-cream-200 bg-white p-7 shadow-subtle transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-50 text-forest-600">
                  <Mail className="h-5 w-5" />
                </span>
                <span className="text-xs font-medium uppercase tracking-widest text-forest-400">
                  Email
                </span>
                <span className="font-display text-lg font-semibold text-forest-900 group-hover:text-forest-700 break-words">
                  {SITE.email}
                </span>
                <span className="text-sm text-forest-500">For catering & general enquiries.</span>
              </a>
            </Reveal>

            {/* Address */}
            <Reveal delay={0.12}>
              <div className="flex h-full flex-col gap-3 rounded-3xl border border-cream-200 bg-white p-7 shadow-subtle">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-50 text-forest-600">
                  <MapPin className="h-5 w-5" />
                </span>
                <span className="text-xs font-medium uppercase tracking-widest text-forest-400">
                  Address
                </span>
                <span className="font-display text-lg font-semibold leading-snug text-forest-900">
                  {SITE.address.line1}
                  <br />
                  {SITE.address.line2}
                </span>
                <a
                  href={SITE.address.mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-forest-700 underline underline-offset-4 hover:text-forest-900"
                >
                  Open in Maps
                  <ChevronRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </Reveal>
          </div>

          {/* Hours band */}
          <Reveal delay={0.1}>
            <div className="mt-6 flex flex-col items-start justify-between gap-5 rounded-3xl bg-forest-800 px-7 py-7 text-cream-50 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-700 text-gold-400">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-gold-400">
                    Open hours
                  </p>
                  <p className="font-display text-lg font-semibold">
                    {SITE.hours[0]?.days} · {SITE.hours[0]?.time}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <OpenStatus variant="pill" />
                <OrderButton variant="gold" size="md" label="Order Online" />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── Map ── */}
      <MapSection />
    </>
  );
}

"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Do you offer halal options?",
    a: "Yes — all our meat is 100% halal. We also serve a generous selection of vegetarian and vegan dishes.",
  },
  {
    q: "Can I order online for pickup or delivery?",
    a: "Absolutely. Order directly through our website or give us a call. We deliver within Ottawa and offer scheduled pickups.",
  },
  {
    q: "How far in advance should I book catering?",
    a: "We recommend at least 7 days for most events. For large weddings or corporate functions, 2–3 weeks is ideal.",
  },
  {
    q: "Do you accommodate dietary restrictions?",
    a: "Yes. We can adjust spice levels, prepare nut-free meals, and offer gluten-friendly options on request.",
  },
  {
    q: "What are your opening hours?",
    a: "Mon – Thu: 11:30 AM – 9:00 PM. Fri – Sat: 11:30 AM – 10:00 PM. Sunday: 12:00 PM – 9:00 PM.",
  },
] as const;

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-paper bg-cream-50 py-20 sm:py-28">
      <Container className="max-w-3xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-clay-500">
            Good to know
          </p>
        </Reveal>
        <Reveal delay={0.04}>
          <span className="mt-5 block h-px w-12 bg-clay-400" />
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-6 font-display text-4xl font-medium tracking-tight text-forest-900 sm:text-5xl">
            Frequently asked
          </h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={0.04 * i} as="div">
                <div
                  className={cn(
                    "rounded-2xl border transition-colors duration-300",
                    isOpen
                      ? "border-sand-300 bg-cream-100 shadow-warm"
                      : "border-cream-300 bg-cream-100/60 hover:border-sand-300 hover:bg-cream-100"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left sm:px-7"
                  >
                    <span
                      className={cn(
                        "font-display text-lg tracking-tight transition-colors sm:text-xl",
                        isOpen ? "text-forest-900" : "text-forest-800"
                      )}
                    >
                      {faq.q}
                    </span>
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                        isOpen
                          ? "border-clay-400 bg-clay-500 text-cream-50"
                          : "border-sand-300 bg-sand-100 text-clay-500"
                      )}
                      aria-hidden="true"
                    >
                      <Plus
                        className={cn(
                          "h-4 w-4 transition-transform duration-300",
                          isOpen && "rotate-45"
                        )}
                        strokeWidth={1.8}
                      />
                    </span>
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300",
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl px-6 pb-6 leading-relaxed text-forest-700 text-pretty sm:px-7">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
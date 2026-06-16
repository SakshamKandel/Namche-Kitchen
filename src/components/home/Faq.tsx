"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Do you offer halal options?",
    a: "Yes — all our meat is 100% halal. We also have a wide selection of vegetarian and vegan dishes.",
  },
  {
    q: "Can I order online for pickup or delivery?",
    a: "Absolutely. You can order directly through our website or call us. We deliver within Calgary and offer scheduled pickups.",
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
    <section className="bg-cream-50 py-12 sm:py-16">
      <Container className="max-w-3xl">
        <Reveal>
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-forest-400">
            Got questions?
          </p>
        </Reveal>
        <Reveal delay={0.04}>
          <h2 className="mt-3 text-center font-display text-4xl font-semibold tracking-tight text-forest-900 sm:text-5xl">
            Frequently asked
          </h2>
        </Reveal>

        <div className="mt-10 flex flex-col gap-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={0.05 * i}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={cn(
                    "flex w-full flex-col rounded-xl border bg-white px-5 py-4 text-left transition-all",
                    isOpen
                      ? "border-forest-200 shadow-subtle"
                      : "border-cream-200 hover:border-forest-200"
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-forest-900">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-forest-500 transition-transform duration-300",
                        isOpen && "rotate-180"
                      )}
                    />
                  </div>
                  <div
                    className={cn(
                      "grid transition-all duration-300",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="pt-3 text-sm leading-relaxed text-forest-500">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

import { Leaf, Flame, Clock, Globe } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

const PILLARS = [
  {
    icon: Flame,
    title: "Hand-folded Momo",
    body: "Each dumpling pinched and pleated by hand — a tradition carried straight from the Himalayas to your plate.",
  },
  {
    icon: Leaf,
    title: "Always Halal",
    body: "Every ingredient, every dish, every day. No exceptions, no compromises.",
  },
  {
    icon: Clock,
    title: "Made Fresh Daily",
    body: "Broths simmered overnight, dough rolled each morning. We never cut corners on freshness.",
  },
  {
    icon: Globe,
    title: "Two Culinary Worlds",
    body: "Himalayan warmth meets Middle-Eastern spice — momo alongside shawarma, chowmein beside biryani.",
  },
] as const;

export function Pillars() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Why Namche"
            title="The way we cook"
            description="Four values that shape every dish we send out of our kitchen."
            align="center"
          />
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <Reveal key={pillar.title} delay={i * 0.08}>
                <div className="flex flex-col gap-4 rounded-3xl border border-forest-100 bg-white/60 p-7 shadow-soft transition-shadow duration-300 hover:shadow-lift">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-50">
                    <Icon className="h-5 w-5 text-forest-700" strokeWidth={1.6} />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-lg font-semibold text-forest-900">
                      {pillar.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-forest-700/75">
                      {pillar.body}
                    </p>
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

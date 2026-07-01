import { Moon, HandHeart, Flame, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

const PILLARS = [
  { icon: Moon, label: "Always Halal" },
  { icon: HandHeart, label: "Hand-folded Fresh Daily" },
  { icon: Flame, label: "Himalayan Spices" },
  { icon: Users, label: "Family-Owned in Ottawa" },
] as const;

export function WhyNamche() {
  return (
    <section className="bg-sand-100 py-8 sm:py-11">
      <Container size="wide">
        <Reveal>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-6 sm:flex sm:items-center sm:justify-between sm:gap-x-8">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <li
                  key={pillar.label}
                  className="flex items-center gap-3 sm:justify-center"
                >
                  <Icon
                    className="h-6 w-6 flex-none text-clay-500"
                    strokeWidth={1.6}
                    aria-hidden
                  />
                  <span className="font-display text-sm font-semibold leading-tight tracking-tight text-forest-900 sm:text-[0.95rem]">
                    {pillar.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}

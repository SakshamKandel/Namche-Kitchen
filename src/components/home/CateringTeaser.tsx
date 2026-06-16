import Link from "next/link";
import { ArrowRight, Briefcase, Heart, Users, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

const EVENTS = [
  {
    icon: Briefcase,
    title: "Corporate",
    desc: "Office lunches, meetings & team events with halal-friendly spreads.",
  },
  {
    icon: Heart,
    title: "Weddings",
    desc: "Receptions, rehearsal dinners & milestone celebrations.",
  },
  {
    icon: Users,
    title: "Cultural",
    desc: "Community gatherings, Eid feasts & festival catering.",
  },
  {
    icon: Sparkles,
    title: "Private",
    desc: "Birthdays, anniversaries & intimate home parties.",
  },
] as const;

export function CateringTeaser() {
  return (
    <section className="bg-cream-50 py-12 sm:py-16">
      <Container>
        {/* Header */}
        <div className="mb-14 flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-forest-400">
                Catering
              </p>
            </Reveal>
            <Reveal delay={0.04}>
              <h2 className="mt-3 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-forest-900 sm:text-6xl lg:text-7xl">
                Himalayan
                <br />
                catering
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-forest-500">
                From intimate gatherings to large celebrations, we craft
                memorable menus that bring people together.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <Link
              href="/catering"
              className={buttonClasses({
                variant: "forest",
                size: "lg",
              })}
            >
              Enquire now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        {/* Event cards — bento grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EVENTS.map((event, i) => (
            <Reveal key={event.title} delay={0.05 * i}>
              <div className="group flex h-full flex-col rounded-2xl border border-cream-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-forest-200 hover:shadow-subtle">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-600 transition-colors duration-300 group-hover:bg-forest-800 group-hover:text-cream-50">
                  <event.icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-forest-900">
                  {event.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-forest-500">
                  {event.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Stats bar */}
        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-forest-800 px-8 py-7 sm:px-10">
            <div className="flex flex-wrap gap-10">
              {[
                { label: "Guests", value: "10 – 500+" },
                { label: "Advance booking", value: "7 days" },
                { label: "Menu style", value: "Fully custom" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-2xl font-semibold text-cream-50">
                    {stat.value}
                  </span>
                  <span className="text-[0.65rem] font-medium uppercase tracking-wider text-cream-200/40">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/catering"
              className={buttonClasses({
                variant: "gold",
                size: "sm",
                className: "shrink-0",
              })}
            >
              Get a quote
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

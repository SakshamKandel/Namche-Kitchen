import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

type Signature = {
  name: string;
  image: string;
  note: string;
  from: string;
  pills: string[];
};

const SIGNATURES: Signature[] = [
  {
    name: "Hand-folded Momo",
    image: "/menu/momo-steam.jpg",
    note: "Pleated by hand, steamed to order, served with our house tomato achar.",
    from: "from $11",
    pills: ["Veg option", "House favourite"],
  },
  {
    name: "Butter Chicken",
    image: "/menu/butter-chicken.jpg",
    note: "Slow-simmered tomato-cream gravy, warm spice, finished with a knob of butter.",
    from: "from $16",
    pills: ["Paneer option", "Mild"],
  },
  {
    name: "Halal Shawarma",
    image: "/menu/shawarma-wrap.jpg",
    note: "Marinated, spit-roasted and wrapped fresh — sandwich, platter or family size.",
    from: "from $10",
    pills: ["Halal"],
  },
];

export function SignatureDishes() {
  return (
    <section className="bg-cream-100 bg-paper">
      <Container className="py-20 sm:py-28">
        <Reveal>
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-clay-500">
              What to try first
            </span>
            <span className="block h-px w-12 bg-clay-400" />
            <h2 className="max-w-2xl font-display text-4xl font-medium tracking-tight text-balance text-forest-900 sm:text-5xl">
              Signatures from our kitchen
            </h2>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-forest-600">
              A few of the plates our regulars come back for — folded, simmered
              and roasted to order, the way we&apos;d serve them at home in
              Ottawa.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-3">
          {SIGNATURES.map((dish, i) => (
            <Reveal key={dish.name} delay={i * 0.08}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-sand-300 bg-cream-50 shadow-warm transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_28px_55px_-20px_rgba(84,51,29,0.35)]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl font-medium tracking-tight text-forest-900">
                      {dish.name}
                    </h3>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-clay-600">
                      {dish.from}
                    </span>
                  </div>
                  <p className="text-pretty text-[0.95rem] leading-relaxed text-forest-600">
                    {dish.note}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {dish.pills.map((pill) => (
                      <span
                        key={pill}
                        className="rounded-full border border-sand-300 px-2.5 py-0.5 text-[0.68rem] font-semibold uppercase tracking-wide text-clay-600"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14">
            <Link
              href="/menu"
              className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-forest-800 transition-colors hover:text-clay-500"
            >
              Explore the full menu
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

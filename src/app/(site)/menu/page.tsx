import type { Metadata } from "next";
import Link from "next/link";
import { getCategoriesWithItems } from "@/lib/queries";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { OrderButton } from "@/components/site/OrderButton";
import { Reveal } from "@/components/motion/Reveal";
import { MenuExplorer } from "@/components/menu/MenuExplorer";
import type { MenuCategory } from "@/components/menu/MenuExplorer";

export const metadata: Metadata = {
  title: "Menu — Namche Kitchen",
  description:
    "Explore our full menu of authentic Himalayan and halal comfort food — hand-folded momo, chowmein, shawarma, curries and more. Order online or dine in.",
};

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const raw = await getCategoriesWithItems({ onlyAvailable: true });

  // Serialise to a plain shape — no Date objects cross the server→client boundary.
  const categories: MenuCategory[] = raw.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    tagline: cat.tagline ?? null,
    items: cat.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description ?? null,
      price: item.price ?? null,
      priceLabel: item.priceLabel ?? null,
      imageUrl: item.imageUrl ?? null,
      options: item.options ?? null,
      tags: item.tags ?? null,
      spiceLevel: item.spiceLevel ?? null,
      featured: item.featured ?? false,
    })),
  }));

  const dishCount = categories.reduce((n, c) => n + c.items.length, 0);
  const categoryCount = categories.length;

  const stats = [
    { value: String(dishCount), label: "Dishes" },
    { value: String(categoryCount), label: "Sections" },
    { value: "100%", label: "Halal shawarma" },
    { value: "Daily", label: "Hand-folded momo" },
  ];

  return (
    <>
      {/* ── Dark immersive menu hero ──────────────────────────────────── */}
      <section className="relative isolate flex min-h-[56vh] items-end overflow-hidden">
        {/* Full-bleed photo */}
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/menu/platter.jpg')" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-950 via-forest-950/80 to-forest-950/45"
        />

        <Container className="py-16 sm:py-20">
          <div className="flex max-w-2xl flex-col gap-5">
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
                Namche Kitchen · Ottawa
              </span>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="font-display text-4xl font-medium tracking-tight text-balance text-cream-50 sm:text-6xl lg:text-7xl">
                The menu
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="max-w-xl text-pretty text-base leading-relaxed text-cream-200/80 sm:text-lg">
                Hand-folded momo, Nepali chowmein, halal shawarma, slow-simmered
                curries and more — made fresh from scratch, every single day.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <OrderButton variant="gold" size="lg" />
                <Link
                  href="/reservations"
                  className={buttonClasses({
                    variant: "outline",
                    size: "lg",
                    className:
                      "border-cream-50/30 text-cream-50 hover:bg-cream-50/10",
                  })}
                >
                  Book a table
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Stat strip beneath the hero */}
      <section className="border-y border-forest-800/70 bg-forest-900 bg-grain">
        <Container>
          <dl className="grid grid-cols-2 divide-x divide-forest-800/60 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col gap-1 py-6 ${
                  i % 2 === 0 ? "pr-6" : "px-6"
                } sm:items-center sm:px-6 sm:text-center`}
              >
                <dt className="font-display text-2xl text-gold-400 sm:text-3xl">
                  {s.value}
                </dt>
                <dd className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-cream-200/55">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ── Interactive explorer (client) ─────────────────────────────── */}
      <MenuExplorer categories={categories} initialQuery={q ?? ""} />
    </>
  );
}

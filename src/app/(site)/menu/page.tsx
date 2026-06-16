import type { Metadata } from "next";
import { getCategoriesWithItems } from "@/lib/queries";
import { Container } from "@/components/ui/Container";
import { OrderButton } from "@/components/site/OrderButton";
import { Reveal } from "@/components/motion/Reveal";
import { MenuExplorer } from "@/components/menu/MenuExplorer";
import type { MenuCategory } from "@/components/menu/MenuExplorer";
import { MenuCollage } from "@/components/menu/MenuCollage";
import { DoodleScatter } from "@/components/decor/DoodleScatter";

export const metadata: Metadata = {
  title: "Menu — Namche Kitchen",
  description:
    "Explore our full menu of authentic Himalayan and Middle-Eastern comfort food — momos, chowmein, shawarma, curries, and more. Order online or dine in.",
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
    })),
  }));

  return (
    <>
      {/* ── Menu header ───────────────────────────────────────────────── */}
      <section className="relative isolate border-b border-cream-200 bg-cream-100 py-16 sm:py-20">
        <DoodleScatter preset="rich" />
        <Container className="flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-widest text-forest-400">
                Namche Kitchen
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="font-display text-4xl font-medium tracking-tight text-balance text-forest-900 sm:text-5xl lg:text-6xl">
                Our Menu
              </h1>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="max-w-xl text-pretty text-base leading-relaxed text-forest-500 sm:text-lg">
                Momo, chowmein, halal shawarma, curries and more — all hand-made
                fresh, every single day.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <OrderButton size="lg" />
            </Reveal>
          </div>

          {/* Signature-dish collage */}
          <MenuCollage />
        </Container>
      </section>

      {/* ── Interactive explorer (client component) ───────────────────── */}
      <MenuExplorer categories={categories} initialQuery={q ?? ""} />
    </>
  );
}

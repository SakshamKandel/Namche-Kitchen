"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { Reveal } from "@/components/motion/Reveal";
import { DoodleScatter } from "@/components/decor/DoodleScatter";
import { cn } from "@/lib/utils";
import { parseTags } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

export type MenuDish = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  priceLabel: string | null;
  imageUrl: string | null;
  options: string | null;
  tags: string | null;
};

export type MenuCategory = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  items: MenuDish[];
};

// ── Dietary filter options ─────────────────────────────────────────────────────

type DietFilter = "all" | "vegetarian" | "vegan" | "halal" | "spicy";

const DIET_FILTERS: { key: DietFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "vegetarian", label: "Vegetarian" },
  { key: "vegan", label: "Vegan" },
  { key: "halal", label: "Halal" },
  { key: "spicy", label: "Spicy" },
];

// ── Helper ────────────────────────────────────────────────────────────────────

function itemMatchesFilter(item: MenuDish, filter: DietFilter): boolean {
  if (filter === "all") return true;
  const tags = parseTags(item.tags);
  return tags.includes(filter);
}

function itemMatchesQuery(item: MenuDish, q: string): boolean {
  if (!q) return true;
  const hay = `${item.name} ${item.description ?? ""} ${item.options ?? ""} ${
    item.tags ?? ""
  }`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => hay.includes(term));
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MenuExplorer({
  categories,
  initialQuery = "",
}: {
  categories: MenuCategory[];
  initialQuery?: string;
}) {
  const [activeSlug, setActiveSlug] = useState<string>(
    categories[0]?.slug ?? ""
  );
  const [dietFilter, setDietFilter] = useState<DietFilter>("all");
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => setQuery(initialQuery), [initialQuery]);

  // Refs for IntersectionObserver targets
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  // ── Filtered data ───────────────────────────────────────────────────────────

  const visibleCategories = categories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          itemMatchesFilter(item, dietFilter) && itemMatchesQuery(item, query)
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  const totalVisible = visibleCategories.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  );

  // ── IntersectionObserver for active nav highlight ───────────────────────────

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (intersecting.length > 0) {
          const slug = intersecting[0].target.getAttribute("data-slug");
          if (slug) setActiveSlug(slug);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: 0,
      }
    );

    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [visibleCategories]);

  // ── Smooth-scroll helper ────────────────────────────────────────────────────

  const scrollToCategory = useCallback((slug: string) => {
    const el = sectionRefs.current.get(slug);
    if (!el) return;
    // Offset for sticky site-header (72px = top-18) + sticky category nav (~56px)
    const offset = 72 + 56 + 16;
    const top =
      el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveSlug(slug);
  }, []);

  // ── Register section refs ───────────────────────────────────────────────────

  const setRef = useCallback(
    (slug: string) => (el: HTMLElement | null) => {
      if (el) {
        sectionRefs.current.set(slug, el);
      } else {
        sectionRefs.current.delete(slug);
      }
    },
    []
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="pb-24">
      {/* ── Sticky nav bar ──────────────────────────────────────────────── */}
      <div className="sticky top-[4.25rem] z-40 border-b border-cream-200 bg-cream-50/90 backdrop-blur">
        <Container size="wide">
          <div className="flex flex-col gap-0">
            {/* Search + diet filters row */}
            <div className="flex items-center gap-2 pt-2.5 pb-2">
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-cream-300 bg-white px-3 py-1.5 focus-within:border-forest-300">
                <Search className="h-3.5 w-3.5 shrink-0 text-forest-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search dishes…"
                  aria-label="Search dishes"
                  className="w-full bg-transparent text-sm text-forest-900 placeholder:text-forest-400 focus:outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="text-forest-500 transition-colors hover:text-forest-800"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Dietary filters — compact row beside search on sm+ */}
              <div className="scrollbar-none hidden items-center gap-1.5 overflow-x-auto sm:flex">
                {DIET_FILTERS.map((f) => {
                  const isActive = dietFilter === f.key;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setDietFilter(f.key)}
                      className={cn(
                        "inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wide transition-colors",
                        isActive
                          ? "border-forest-300 bg-forest-50 text-forest-700"
                          : "border-cream-300 text-forest-500 hover:border-forest-200 hover:text-forest-700"
                      )}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category chips — horizontal scroll with snap */}
            <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto pb-2.5 [scroll-snap-type:x_mandatory]">
              {categories.map((cat) => {
                const hasVisible = visibleCategories.some(
                  (v) => v.slug === cat.slug
                );
                if (!hasVisible) return null;

                const isActive = cat.slug === activeSlug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => scrollToCategory(cat.slug)}
                    className={cn(
                      "inline-flex shrink-0 items-center rounded-full px-3 py-1 text-[0.8rem] font-medium transition-colors [scroll-snap-align:start] sm:px-4 sm:py-1.5 sm:text-sm",
                      isActive
                        ? "bg-forest-800 text-cream-50"
                        : "bg-forest-50 text-forest-600 hover:bg-forest-100"
                    )}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Dietary filters — mobile only, below categories */}
            <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto pb-2.5 sm:hidden">
              {DIET_FILTERS.map((f) => {
                const isActive = dietFilter === f.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setDietFilter(f.key)}
                    className={cn(
                      "inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wide transition-colors",
                      isActive
                        ? "border-forest-300 bg-forest-50 text-forest-700"
                        : "border-cream-300 text-forest-500 hover:border-forest-200 hover:text-forest-700"
                    )}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Container>
      </div>

      {/* ── Category sections ────────────────────────────────────────────── */}
      {totalVisible === 0 ? (
        // Empty state
        <Container size="narrow" className="py-24 text-center">
          <Reveal>
            <div className="flex flex-col items-center gap-5">
              <span className="text-4xl">🍃</span>
              <p className="font-display text-xl text-forest-800">
                {query
                  ? `Nothing matches “${query}”`
                  : "No items match that filter"}
              </p>
              <p className="text-forest-600/75">
                Try a different search or dietary preference.
              </p>
              <button
                type="button"
                onClick={() => {
                  setDietFilter("all");
                  setQuery("");
                }}
                className="mt-2 inline-flex items-center rounded-full bg-forest-800 px-5 py-2 text-sm font-medium text-cream-50 transition-colors hover:bg-forest-700"
              >
                Show all items
              </button>
            </div>
          </Reveal>
        </Container>
      ) : (
        <div className="mt-12 flex flex-col gap-20">
          {visibleCategories.map((cat, catIdx) => (
            <section
              key={cat.id}
              id={cat.slug}
              data-slug={cat.slug}
              ref={setRef(cat.slug)}
              className="relative isolate"
            >
              <DoodleScatter preset="soft" />
              <Container size="default">
                {/* Category heading */}
                <Reveal delay={0.04 * (catIdx % 5)}>
                  <SectionHeading
                    eyebrow={cat.tagline ?? undefined}
                    title={cat.name}
                    align="left"
                    tone="forest"
                    className="mb-8"
                  />
                </Reveal>

                {/* Item card grid */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.items.map((item, itemIdx) => (
                    <Reveal key={item.id} delay={0.03 * (itemIdx % 6)} y={10}>
                      <MenuItemCard item={item} />
                    </Reveal>
                  ))}
                </div>
              </Container>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

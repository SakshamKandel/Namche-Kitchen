"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, X, List, LayoutGrid, Leaf, Heart } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { MenuListRow } from "@/components/menu/MenuListRow";
import { ChefsPicks } from "@/components/menu/ChefsPicks";
import { DishQuickView } from "@/components/menu/DishQuickView";
import { Reveal } from "@/components/motion/Reveal";
import { useFavourites } from "@/lib/useFavourites";
import { cn, parseTags } from "@/lib/utils";

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
  spiceLevel?: number | null;
  featured?: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  items: MenuDish[];
};

// ── Dietary filter options ─────────────────────────────────────────────────────

type DietFilter =
  | "all"
  | "vegetarian"
  | "vegan"
  | "halal"
  | "spicy"
  | "favourites";

const DIET_FILTERS: { key: DietFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "vegetarian", label: "Vegetarian" },
  { key: "vegan", label: "Vegan" },
  { key: "halal", label: "Halal" },
  { key: "spicy", label: "Spicy" },
];

type ViewMode = "list" | "grid";

// ── Helpers ─────────────────────────────────────────────────────────────────────

function itemMatchesFilter(item: MenuDish, filter: DietFilter): boolean {
  if (filter === "all") return true;
  return parseTags(item.tags).includes(filter);
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
  const [view, setView] = useState<ViewMode>("list");

  // Favourites (localStorage) + the currently open dish quick-view.
  const fav = useFavourites();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => setQuery(initialQuery), [initialQuery]);

  // Flat index: dish id → { dish, category } so the quick-view can resolve its
  // section name + "more from this section" list from any entry point.
  const dishIndex = useMemo(() => {
    const map = new Map<
      string,
      { dish: MenuDish; categoryName: string; categorySlug: string }
    >();
    for (const cat of categories) {
      for (const d of cat.items) {
        map.set(d.id, {
          dish: d,
          categoryName: cat.name,
          categorySlug: cat.slug,
        });
      }
    }
    return map;
  }, [categories]);

  const featuredDishes = useMemo(
    () => categories.flatMap((c) => c.items).filter((d) => d.featured).slice(0, 12),
    [categories]
  );

  const selected = selectedId ? dishIndex.get(selectedId) ?? null : null;
  const relatedDishes = selected
    ? (categories.find((c) => c.slug === selected.categorySlug)?.items ?? [])
        .filter((d) => d.id !== selected.dish.id)
        .slice(0, 10)
    : [];

  const openDish = useCallback((dish: { id?: string }) => {
    if (dish.id) setSelectedId(dish.id);
  }, []);

  // If favourites is the active filter but nothing is saved, fall back to all.
  useEffect(() => {
    if (dietFilter === "favourites" && fav.ready && fav.count === 0) {
      setDietFilter("all");
    }
  }, [dietFilter, fav.ready, fav.count]);

  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const barRef = useRef<HTMLDivElement>(null);

  // ── Filtered data ───────────────────────────────────────────────────────────

  const visibleCategories = categories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          (dietFilter === "favourites"
            ? fav.isFavourite(item.id)
            : itemMatchesFilter(item, dietFilter)) &&
          itemMatchesQuery(item, query)
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  const totalVisible = visibleCategories.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  );
  const totalAll = categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const isFiltered = dietFilter !== "all" || query.trim().length > 0;

  // ── Scroll-spy for the active category chip ─────────────────────────────────

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (intersecting.length > 0) {
          const slug = intersecting[0].target.getAttribute("data-slug");
          if (slug) setActiveSlug(slug);
        }
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
    );
    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [visibleCategories]);

  // ── Smooth-scroll to a category, clearing the sticky header + control bar ────

  const scrollToCategory = useCallback((slug: string) => {
    const el = sectionRefs.current.get(slug);
    if (!el) return;
    const header = document.querySelector("header");
    const headerH = header instanceof HTMLElement ? header.offsetHeight : 68;
    const barH = barRef.current?.offsetHeight ?? 120;
    const offset = headerH + barH + 20;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveSlug(slug);
  }, []);

  const setRef = useCallback(
    (slug: string) => (el: HTMLElement | null) => {
      if (el) sectionRefs.current.set(slug, el);
      else sectionRefs.current.delete(slug);
    },
    []
  );

  function clearAll() {
    setDietFilter("all");
    setQuery("");
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="bg-grain bg-forest-950 pb-28 text-cream-100">
      {/* ── Chef's picks rail ────────────────────────────────────────────── */}
      <ChefsPicks
        dishes={featuredDishes}
        onSelect={openDish}
        isFavourite={fav.isFavourite}
        onToggleFavourite={fav.toggle}
      />

      {/* ── Sticky control bar ──────────────────────────────────────────── */}
      <div
        ref={barRef}
        className="sticky top-[4rem] z-40 border-b border-forest-800/70 bg-forest-950/92 backdrop-blur supports-[backdrop-filter]:bg-forest-950/80"
      >
        <Container size="wide">
          {/* Row 1 — search · count · view toggle */}
          <div className="flex items-center gap-3 pt-3.5 pb-2.5">
            <div className="flex flex-1 items-center gap-2 rounded-full border border-forest-700/70 bg-forest-900/60 px-4 py-2 transition-colors focus-within:border-gold-400/60">
              <Search className="h-4 w-4 shrink-0 text-cream-200/45" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the menu…"
                aria-label="Search dishes"
                className="w-full bg-transparent text-sm text-cream-50 placeholder:text-cream-200/40 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="text-cream-200/50 transition-colors hover:text-cream-50"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <span className="hidden shrink-0 text-xs font-medium uppercase tracking-[0.16em] text-cream-200/45 md:inline">
              {isFiltered ? `${totalVisible} of ${totalAll}` : `${totalAll}`}{" "}
              dishes
            </span>

            {/* List / grid toggle */}
            <div className="hidden shrink-0 items-center gap-0.5 rounded-full border border-forest-700/70 p-0.5 sm:flex">
              {(
                [
                  { key: "list" as const, icon: List, label: "List view" },
                  { key: "grid" as const, icon: LayoutGrid, label: "Grid view" },
                ]
              ).map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setView(key)}
                  aria-label={label}
                  aria-pressed={view === key}
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                    view === key
                      ? "bg-gold-400 text-forest-900"
                      : "text-cream-200/55 hover:text-cream-50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Row 2 — category chips (scroll-spy) */}
          <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto pb-2 [scroll-snap-type:x_mandatory]">
            {categories.map((cat) => {
              if (!visibleCategories.some((v) => v.slug === cat.slug)) return null;
              const active = cat.slug === activeSlug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => scrollToCategory(cat.slug)}
                  className={cn(
                    "inline-flex shrink-0 items-center rounded-full px-3.5 py-1.5 text-[0.8rem] font-medium transition-colors [scroll-snap-align:start]",
                    active
                      ? "bg-gold-400 text-forest-900"
                      : "border border-forest-700/70 text-cream-200/70 hover:border-forest-600 hover:text-cream-50"
                  )}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Row 3 — dietary filters */}
          <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto pb-3">
            <Leaf className="hidden h-3.5 w-3.5 shrink-0 text-gold-400/70 sm:block" />
            {DIET_FILTERS.map((f) => {
              const active = dietFilter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setDietFilter(f.key)}
                  className={cn(
                    "inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.1em] transition-colors",
                    active
                      ? "border-gold-400/70 bg-gold-400/10 text-gold-400"
                      : "border-forest-700/60 text-cream-200/55 hover:border-forest-600 hover:text-cream-100"
                  )}
                >
                  {f.label}
                </button>
              );
            })}

            {fav.count > 0 && (
              <button
                type="button"
                onClick={() =>
                  setDietFilter(
                    dietFilter === "favourites" ? "all" : "favourites"
                  )
                }
                aria-pressed={dietFilter === "favourites"}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.1em] transition-colors",
                  dietFilter === "favourites"
                    ? "border-gold-400/70 bg-gold-400/10 text-gold-400"
                    : "border-forest-700/60 text-cream-200/55 hover:border-forest-600 hover:text-cream-100"
                )}
              >
                <Heart
                  className={cn(
                    "h-3 w-3",
                    dietFilter === "favourites" && "fill-gold-400"
                  )}
                />
                Favourites
                <span className="tabular-nums text-cream-200/50">
                  {fav.count}
                </span>
              </button>
            )}

            {isFiltered && (
              <button
                type="button"
                onClick={clearAll}
                className="ml-1 inline-flex shrink-0 items-center gap-1 text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-cream-200/45 transition-colors hover:text-gold-400"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>
        </Container>
      </div>

      {/* ── Category sections ────────────────────────────────────────────── */}
      {totalVisible === 0 ? (
        <Container size="narrow" className="py-16 text-center sm:py-28">
          <Reveal>
            <div className="flex flex-col items-center gap-5">
              <Leaf className="h-9 w-9 text-gold-400/70" />
              <p className="font-display text-2xl text-cream-50">
                {query ? `Nothing matches “${query}”` : "No dishes match that filter"}
              </p>
              <p className="text-cream-200/60">
                Try a different search or dietary preference.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-2 inline-flex items-center rounded-full bg-gold-400 px-6 py-2.5 text-sm font-semibold text-forest-900 transition-colors hover:bg-gold-300"
              >
                Show the full menu
              </button>
            </div>
          </Reveal>
        </Container>
      ) : (
        <div className="flex flex-col gap-16 pt-14 sm:gap-20">
          {visibleCategories.map((cat, catIdx) => (
            <section
              key={cat.id}
              id={cat.slug}
              data-slug={cat.slug}
              ref={setRef(cat.slug)}
              className="scroll-mt-40"
            >
              <Container size="default">
                {/* Category heading */}
                <Reveal delay={0.03 * (catIdx % 4)}>
                  <div className="mb-8 flex flex-col gap-3">
                    {cat.tagline && (
                      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
                        {cat.tagline}
                      </span>
                    )}
                    <div className="flex items-baseline gap-4">
                      <h2 className="font-display text-3xl font-medium tracking-tight text-cream-50 sm:text-4xl">
                        {cat.name}
                      </h2>
                      <span className="font-display text-base text-cream-200/35">
                        {cat.items.length}
                      </span>
                    </div>
                    <span className="block h-px w-full bg-gradient-to-r from-gold-400/40 via-forest-700/50 to-transparent" />
                  </div>
                </Reveal>

                {/* Items — list or grid */}
                {view === "list" ? (
                  <ul className="grid grid-cols-1 gap-x-14 md:grid-cols-2">
                    {cat.items.map((item) => (
                      <MenuListRow
                        key={item.id}
                        item={item}
                        onSelect={openDish}
                        isFavourite={fav.isFavourite}
                        onToggleFavourite={fav.toggle}
                      />
                    ))}
                  </ul>
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {cat.items.map((item, itemIdx) => (
                      <Reveal key={item.id} delay={0.03 * (itemIdx % 6)} y={10}>
                        <MenuItemCard
                          item={item}
                          onSelect={openDish}
                          isFavourite={fav.isFavourite}
                          onToggleFavourite={fav.toggle}
                        />
                      </Reveal>
                    ))}
                  </div>
                )}
              </Container>
            </section>
          ))}
        </div>
      )}

      {/* ── Dish quick-view (portal modal) ───────────────────────────────── */}
      <DishQuickView
        dish={selected?.dish ?? null}
        categoryName={selected?.categoryName ?? null}
        related={relatedDishes}
        isFavourite={fav.isFavourite}
        onToggleFavourite={fav.toggle}
        onSelectDish={openDish}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}

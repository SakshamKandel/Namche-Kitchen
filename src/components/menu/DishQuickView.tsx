"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Heart, ArrowRight } from "lucide-react";
import { cn, displayPrice, parseTags } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { SpiceMeter, spiceLevelFor } from "@/components/menu/SpiceMeter";
import { DishImage } from "@/components/menu/DishImage";
import type { MenuDish } from "@/components/menu/MenuExplorer";

const EASE = [0.22, 1, 0.36, 1] as const;

// Tag -> display label map (shared across the site).
const TAG_LABELS: Record<string, string> = {
  halal: "Halal",
  vegetarian: "Veg",
  vegan: "Vegan",
  spicy: "Spicy",
  popular: "Popular",
  new: "New",
};

// The single overlay badge shown on the photo, by priority.
const BADGE_PRIORITY = ["popular", "halal", "spicy", "vegan", "vegetarian"] as const;

// Which tags render as dietary pills (order preserved).
const PILL_PRIORITY = [
  "popular",
  "new",
  "halal",
  "vegetarian",
  "vegan",
  "spicy",
] as const;

/** Selector for tabbable elements used by the focus trap. */
const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function DishQuickView(props: {
  dish: MenuDish | null;
  categoryName?: string | null;
  related?: MenuDish[];
  isFavourite: (id: string) => boolean;
  onToggleFavourite: (id: string) => void;
  onSelectDish: (dish: MenuDish) => void;
  onClose: () => void;
}): React.ReactElement | null {
  const {
    dish,
    categoryName,
    related,
    isFavourite,
    onToggleFavourite,
    onSelectDish,
    onClose,
  } = props;

  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const open = dish !== null;

  // Stable handler so effect deps stay clean.
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Lock body scroll, wire ESC + a simple focus trap while the modal is open.
  useEffect(() => {
    if (!open) return;
    if (typeof document === "undefined") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus onto the close button once mounted.
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !panel.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !panel.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, handleClose]);

  if (typeof document === "undefined") return null;
  if (!dish) return null;

  const tags = parseTags(dish.tags);
  const spice =
    dish.spiceLevel && dish.spiceLevel > 0
      ? dish.spiceLevel
      : spiceLevelFor(tags, dish.name);

  const price = displayPrice(dish);
  const fav = isFavourite(dish.id);

  const badgeTag = BADGE_PRIORITY.find((t) => tags.includes(t));
  const pillTags = PILL_PRIORITY.filter((t) => tags.includes(t));

  const backdropMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };

  const panelMotion = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, scale: 0.96, y: 12 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 12 },
      };

  const node = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="dish-quickview-backdrop"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-forest-950/80 p-4 backdrop-blur-sm"
          onClick={handleClose}
          {...backdropMotion}
          transition={{ duration: 0.25, ease: EASE }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={dish.name}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] w-full max-w-2xl overflow-y-auto overflow-x-hidden rounded-2xl border border-forest-700/70 bg-forest-900 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]"
            {...panelMotion}
            transition={{ duration: 0.32, ease: EASE }}
          >
            {/* Photo */}
            <div className="relative aspect-[16/10] w-full">
              <DishImage
                src={dish.imageUrl}
                alt={dish.name}
                className="absolute inset-0"
                sizes="(max-width:768px) 100vw, 640px"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950/70 via-forest-950/10 to-transparent"
              />

              {badgeTag && (
                <span className="absolute left-4 top-4 rounded-full border border-gold-400/30 bg-forest-950/70 px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-gold-400/90 backdrop-blur-sm">
                  {TAG_LABELS[badgeTag]}
                </span>
              )}

              <div className="absolute right-4 top-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleFavourite(dish.id)}
                  aria-pressed={fav}
                  aria-label={
                    fav
                      ? `Remove ${dish.name} from favourites`
                      : `Save ${dish.name} to favourites`
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-950/70 text-cream-100 backdrop-blur-sm transition-colors hover:text-gold-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/70"
                >
                  <Heart
                    className={cn(
                      "h-4.5 w-4.5 transition-colors",
                      fav ? "fill-gold-400 text-gold-400" : "text-current",
                    )}
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  ref={closeButtonRef}
                  onClick={handleClose}
                  aria-label="Close dish details"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-950/70 text-cream-100 backdrop-blur-sm transition-colors hover:text-gold-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/70"
                >
                  <X className="h-4.5 w-4.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3 p-6 sm:p-7">
              {categoryName && (
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-gold-400">
                  {categoryName}
                </p>
              )}

              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display text-3xl leading-tight text-cream-50">
                  {dish.name}
                </h2>
                {price && (
                  <span className="mt-1 shrink-0 font-display text-xl text-gold-400">
                    {price}
                  </span>
                )}
              </div>

              {dish.options && (
                <p className="text-xs uppercase tracking-wide text-cream-200/50">
                  {dish.options}
                </p>
              )}

              {dish.description && (
                <p className="leading-relaxed text-cream-200/75">
                  {dish.description}
                </p>
              )}

              {(spice > 0 || pillTags.length > 0) && (
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {spice > 0 && <SpiceMeter level={spice} />}
                  {pillTags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-gold-400/30 px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-gold-400/90"
                    >
                      {TAG_LABELS[t]}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA row */}
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <a
                  href={SITE.orderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-5 py-2.5 font-semibold text-forest-900 transition-colors hover:bg-gold-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-900"
                >
                  Order online
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={() => onToggleFavourite(dish.id)}
                  aria-pressed={fav}
                  className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold text-cream-200/80 transition-colors hover:text-gold-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/70"
                >
                  <Heart
                    className={cn(
                      "h-4 w-4",
                      fav ? "fill-gold-400 text-gold-400" : "text-current",
                    )}
                    aria-hidden="true"
                  />
                  {fav ? "Saved" : "Save"}
                </button>
              </div>

              {/* More from category */}
              {related && related.length > 0 && (
                <div className="mt-5 border-t border-forest-700/60 pt-5">
                  <h3 className="mb-3 text-sm font-semibold text-cream-100">
                    {categoryName ? `More from ${categoryName}` : "More dishes"}
                  </h3>
                  <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {related.map((r) => {
                      const rPrice = displayPrice(r);
                      return (
                        <li key={r.id} className="shrink-0 snap-start">
                          <button
                            type="button"
                            onClick={() => onSelectDish(r)}
                            className="group flex w-40 flex-col overflow-hidden rounded-xl border border-forest-700/60 bg-forest-800/40 text-left transition-colors hover:border-gold-400/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/70"
                          >
                            <DishImage
                              src={r.imageUrl}
                              alt={r.name}
                              className="aspect-[4/3] w-full"
                              sizes="160px"
                            />
                            <div className="flex flex-1 flex-col gap-1 p-3">
                              <span className="font-display text-sm leading-snug text-cream-50">
                                {r.name}
                              </span>
                              {rPrice && (
                                <span className="text-xs text-gold-400">
                                  {rPrice}
                                </span>
                              )}
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(node, document.body);
}

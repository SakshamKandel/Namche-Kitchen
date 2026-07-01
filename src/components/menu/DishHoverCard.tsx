"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn, displayPrice, parseTags } from "@/lib/utils";
import { SpiceMeter, spiceLevelFor } from "@/components/menu/SpiceMeter";
import { DishImage } from "@/components/menu/DishImage";
import type { MenuDish } from "@/components/menu/MenuExplorer";

const TAG_LABELS: Record<string, string> = {
  halal: "Halal",
  vegetarian: "Veg",
  vegan: "Vegan",
  spicy: "Spicy",
  popular: "Popular",
  new: "New",
};

const CARD_WIDTH = 256; // w-64
const EST_CARD_HEIGHT = 280;
const EDGE_GAP = 8;
const TRIGGER_GAP = 12;

const OPEN_DELAY = 140;
const CLOSE_DELAY = 120;

const EASE = [0.22, 1, 0.36, 1] as const;

type Coords = { top: number; left: number };

export function DishHoverCard(props: {
  dish: MenuDish;
  children: React.ReactNode;
  onOpen?: () => void;
  className?: string;
}): React.ReactElement {
  const { dish, children, onOpen, className } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [mounted, setMounted] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<Coords>({ top: 0, left: 0 });

  const reducedMotion = useReducedMotion();
  const hoverEnabled = canHover && !reducedMotion;

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && window.matchMedia) {
      setCanHover(
        window.matchMedia("(hover: hover) and (pointer: fine)").matches
      );
    }
  }, []);

  const clearTimers = useCallback(() => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const computePosition = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Prefer the right of the trigger; fall back to the left on overflow.
    let left = rect.right + TRIGGER_GAP;
    if (left + CARD_WIDTH + EDGE_GAP > vw) {
      left = rect.left - TRIGGER_GAP - CARD_WIDTH;
    }
    // Final clamp so the card never leaves the viewport horizontally.
    left = Math.min(Math.max(left, EDGE_GAP), vw - CARD_WIDTH - EDGE_GAP);

    let top = rect.top;
    const maxTop = vh - EST_CARD_HEIGHT - EDGE_GAP;
    top = Math.min(Math.max(top, EDGE_GAP), Math.max(EDGE_GAP, maxTop));

    setCoords({ top, left });
  }, []);

  const startOpen = useCallback(() => {
    if (!hoverEnabled) return;
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    if (openTimer.current) return;
    openTimer.current = setTimeout(() => {
      openTimer.current = null;
      computePosition();
      setOpen(true);
    }, OPEN_DELAY);
  }, [hoverEnabled, computePosition]);

  const startClose = useCallback(() => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    if (closeTimer.current) return;
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      setOpen(false);
    }, CLOSE_DELAY);
  }, []);

  // Reposition while open; tear down on close.
  useEffect(() => {
    if (!open) return;
    const onScroll = () => computePosition();
    const onResize = () => computePosition();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [open, computePosition]);

  // Cleanup on unmount.
  useEffect(() => clearTimers, [clearTimers]);

  const handleClick = useCallback(() => {
    if (onOpen) onOpen();
  }, [onOpen]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!onOpen) return;
      if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        onOpen();
      }
    },
    [onOpen]
  );

  const interactive = Boolean(onOpen);

  const tags = parseTags(dish.tags);
  const spice =
    dish.spiceLevel && dish.spiceLevel > 0
      ? dish.spiceLevel
      : spiceLevelFor(tags, dish.name);
  const price = displayPrice(dish);
  const dietTags = tags.filter((t) => TAG_LABELS[t]).slice(0, 3);

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "relative",
        interactive &&
          "cursor-pointer rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-400/50",
        className
      )}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? handleClick : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      onMouseEnter={hoverEnabled ? startOpen : undefined}
      onMouseLeave={hoverEnabled ? startClose : undefined}
    >
      {children}

      {mounted && hoverEnabled
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  key="dish-hover-card"
                  initial={{ opacity: 0, scale: 0.97, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: 4 }}
                  transition={{ duration: 0.16, ease: EASE }}
                  style={{
                    position: "fixed",
                    top: coords.top,
                    left: coords.left,
                  }}
                  className="z-[70] w-64 origin-top-left"
                  onMouseEnter={startOpen}
                  onMouseLeave={startClose}
                >
                  <div className="overflow-hidden rounded-xl border border-forest-700/70 bg-forest-900 shadow-[0_24px_48px_-18px_rgba(0,0,0,0.65)]">
                    <div className="relative aspect-[4/3]">
                      <DishImage
                        src={dish.imageUrl}
                        alt={dish.name}
                        className="absolute inset-0"
                        sizes="256px"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 p-3.5">
                      <h3 className="font-display text-base leading-tight text-cream-50">
                        {dish.name}
                      </h3>
                      {price ? (
                        <p className="text-sm text-gold-400">{price}</p>
                      ) : null}
                      {dish.description ? (
                        <p className="line-clamp-2 text-xs text-cream-200/65">
                          {dish.description}
                        </p>
                      ) : null}
                      {spice > 0 || dietTags.length > 0 ? (
                        <div className="mt-0.5 flex flex-wrap items-center gap-2">
                          <SpiceMeter level={spice} />
                          {dietTags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-gold-400/30 px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-gold-400/90"
                            >
                              {TAG_LABELS[tag]}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <p className="mt-1 text-[0.62rem] uppercase tracking-[0.12em] text-cream-200/40">
                        Click for details &rarr;
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </div>
  );
}

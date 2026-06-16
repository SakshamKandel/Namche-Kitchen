"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Horizontal scroll-snap row with circular prev/next arrows (Foodzi-style). */
export function ScrollRow({
  children,
  className,
  ariaLabel = "Scrollable row",
}: {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scrollByDir = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({
      left: dir * Math.min(680, el.clientWidth * 0.85),
      behavior: "smooth",
    });
  };

  const arrowBase =
    "absolute top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg border border-cream-200 bg-white text-forest-700 transition hover:bg-forest-50 disabled:cursor-default disabled:opacity-0 sm:flex";

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollByDir(-1)}
        disabled={!canLeft}
        className={cn(arrowBase, "-left-3 lg:-left-5")}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div
        ref={ref}
        onScroll={update}
        role="group"
        aria-label={ariaLabel}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: "x proximity" }}
      >
        {children}
      </div>

      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollByDir(1)}
        disabled={!canRight}
        className={cn(arrowBase, "-right-3 lg:-right-5")}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

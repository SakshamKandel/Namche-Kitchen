import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind-aware className combiner. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a numeric price as CAD, e.g. 13.99 -> "$13.99". */
export function formatPrice(price?: number | null): string | null {
  if (price === null || price === undefined) return null;
  return `$${price.toFixed(2)}`;
}

/** Best price string for a menu item: numeric price wins, else freeform label. */
export function displayPrice(item: {
  price?: number | null;
  priceLabel?: string | null;
}): string | null {
  return formatPrice(item.price) ?? item.priceLabel ?? null;
}

/** Parse a comma-separated tag string into a clean array. */
export function parseTags(tags?: string | null): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

/** kebab-case a string for use as a slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Human-friendly date, e.g. "Mon, Jun 16, 2026". */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

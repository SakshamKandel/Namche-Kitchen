/**
 * Hand-drawn, line-art food doodles for Namche Kitchen.
 *
 * Each doodle is a single-colour SVG that inherits `currentColor`, so the
 * colour is set by the parent's text colour (e.g. `text-forest-200`) and the
 * size by width/height utilities (e.g. `h-16 w-16`). They are purely
 * decorative — always rendered `aria-hidden`.
 *
 * Use the {@link Doodle} switch or {@link DoodleScatter} (separate file) rather
 * than wiring these up by hand on every page.
 */
import * as React from "react";

export type DoodleProps = {
  className?: string;
  strokeWidth?: number;
};

function Svg({
  children,
  className,
  strokeWidth = 2,
}: DoodleProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

/* ── Steamed momo (dumpling) ─────────────────────────────────────────── */
export function MomoDoodle(p: DoodleProps) {
  return (
    <Svg {...p}>
      <path d="M14 38c0-12 8-20 18-20s18 8 18 20c0 7-8 12-18 12s-18-5-18-12Z" />
      <path d="M32 18c-2.5 4-6 7-10.5 9" />
      <path d="M32 18c-1 4-2 7-3.5 9" />
      <path d="M32 18c1 4 2 7 3.5 9" />
      <path d="M32 18c2.5 4 6 7 10.5 9" />
    </Svg>
  );
}

/* ── Rising steam ────────────────────────────────────────────────────── */
export function SteamDoodle(p: DoodleProps) {
  return (
    <Svg {...p}>
      <path d="M22 48c-5-5 5-9 0-14s5-9 0-14" />
      <path d="M32 50c-5-5 5-9 0-14s5-9 0-14" />
      <path d="M42 48c-5-5 5-9 0-14s5-9 0-14" />
    </Svg>
  );
}

/* ── Chilli pepper ───────────────────────────────────────────────────── */
export function ChilliDoodle(p: DoodleProps) {
  return (
    <Svg {...p}>
      <path d="M44 20c0 10-5 20-15 26-5 3-12 4-16 1-3-2-2-6 1-8 8-5 14-12 17-21" />
      <path d="M44 20l2-5c1-2 4-3 6-1" />
    </Svg>
  );
}

/* ── Noodle bowl with chopsticks ─────────────────────────────────────── */
export function NoodleBowlDoodle(p: DoodleProps) {
  return (
    <Svg {...p}>
      <path d="M11 33h42a21 21 0 0 1-42 0Z" />
      <path d="M19 31c2-6 7-10 13-10s11 4 13 10" />
      <path d="M24 30c1-4 4-6 8-6" />
      <path d="M39 13l13-6" />
      <path d="M42 18l13-6" />
    </Svg>
  );
}

/* ── Tea cup with steam ──────────────────────────────────────────────── */
export function TeaCupDoodle(p: DoodleProps) {
  return (
    <Svg {...p}>
      <path d="M16 30h27v7c0 7-6 13-13.5 13S16 44 16 37v-7Z" />
      <path d="M43 32h4a5 5 0 0 1 0 10h-3" />
      <path d="M13 54h33" />
      <path d="M25 24c-3-3 3-5 0-9" />
      <path d="M33 24c-3-3 3-5 0-9" />
    </Svg>
  );
}

/* ── Mountain + sun (Himalayan motif) ────────────────────────────────── */
export function MountainDoodle(p: DoodleProps) {
  return (
    <Svg {...p}>
      <circle cx="46" cy="19" r="6" />
      <path d="M6 50l17-27 9 14 7-10 13 23Z" />
      <path d="M23 23l-4 7 3-1 1.5 2.5L28 31l3 1-3-6" />
    </Svg>
  );
}

/* ── Herb sprig (coriander / mint) ───────────────────────────────────── */
export function LeafDoodle(p: DoodleProps) {
  return (
    <Svg {...p}>
      <path d="M32 54c-1-16 1-28 9-37" />
      <path d="M32 40c-6-1-10-6-11-12 6-1 11 2 14 8" />
      <path d="M34 31c0-6 3-11 9-13 1 6-2 11-7 14" />
      <path d="M32 47c-6 0-11-4-12-10 6-1 11 1 14 6" />
    </Svg>
  );
}

/* ── Citrus slice (lemon / lime) ─────────────────────────────────────── */
export function CitrusDoodle(p: DoodleProps) {
  return (
    <Svg {...p}>
      <circle cx="32" cy="32" r="19" />
      <circle cx="32" cy="32" r="13" />
      <path d="M32 19v-6M32 45v6M19 32h-6M45 32h6" />
      <path d="M41.2 22.8l4.3-4.3M22.8 41.2l-4.3 4.3M41.2 41.2l4.3 4.3M22.8 22.8l-4.3-4.3" />
    </Svg>
  );
}

/* ── Samosa ──────────────────────────────────────────────────────────── */
export function SamosaDoodle(p: DoodleProps) {
  return (
    <Svg {...p}>
      <path d="M32 13 54 50a3 3 0 0 1-2.6 4.5H12.6A3 3 0 0 1 10 50Z" />
      <path d="M32 13v32" />
      <path d="M32 45 17 53M32 45l15 8" />
    </Svg>
  );
}

/* ── Naan / flatbread ────────────────────────────────────────────────── */
export function NaanDoodle(p: DoodleProps) {
  return (
    <Svg {...p}>
      <path d="M16 30c-2-8 7-14 18-14s17 5 16 12 4 14-6 16-12-1-18 1-12-7-10-15Z" />
      <path d="M26 28h.01M34 24h.01M40 32h.01M30 36h.01M22 35h.01" strokeWidth={3} />
    </Svg>
  );
}

/* ── Whisk ───────────────────────────────────────────────────────────── */
export function WhiskDoodle(p: DoodleProps) {
  return (
    <Svg {...p}>
      <path d="M30 12h4l1 8h-6z" />
      <path d="M28 20c-6 6-8 16-4 28h16c4-12 2-22-4-28" />
      <path d="M32 20v36" />
      <path d="M24.5 26c-2 10-1 18 2 26" />
      <path d="M39.5 26c2 10 1 18-2 26" />
      <path d="M22 40h20" />
    </Svg>
  );
}

/* ── Cooking pot with steam ──────────────────────────────────────────── */
export function PotDoodle(p: DoodleProps) {
  return (
    <Svg {...p}>
      <path d="M13 31h38v6c0 8-7 13-19 13s-19-5-19-13v-6Z" />
      <path d="M10 31h44" />
      <path d="M10 29h5M49 29h5" />
      <path d="M26 24c-3-3 3-5 0-9" />
      <path d="M38 24c-3-3 3-5 0-9" />
    </Svg>
  );
}

/* ── Sparkle ─────────────────────────────────────────────────────────── */
export function SparkleDoodle(p: DoodleProps) {
  return (
    <Svg {...p}>
      <path d="M32 14c2 10 6 14 16 18-10 4-14 8-16 18-2-10-6-14-16-18 10-4 14-8 16-18Z" />
    </Svg>
  );
}

/* ── Star ────────────────────────────────────────────────────────────── */
export function StarDoodle(p: DoodleProps) {
  return (
    <Svg {...p}>
      <path d="M32 13l5.5 13L51 27l-10 8.5 3.2 13.5L32 42l-12.2 7 3.2-13.5L13 27l13.5-1z" />
    </Svg>
  );
}

/* ── Registry + switch ───────────────────────────────────────────────── */
export const DOODLES = {
  momo: MomoDoodle,
  steam: SteamDoodle,
  chilli: ChilliDoodle,
  bowl: NoodleBowlDoodle,
  tea: TeaCupDoodle,
  mountain: MountainDoodle,
  leaf: LeafDoodle,
  citrus: CitrusDoodle,
  samosa: SamosaDoodle,
  naan: NaanDoodle,
  whisk: WhiskDoodle,
  pot: PotDoodle,
  sparkle: SparkleDoodle,
  star: StarDoodle,
} as const;

export type DoodleName = keyof typeof DOODLES;

/** Render a doodle by name. */
export function Doodle({
  name,
  className,
  strokeWidth,
}: { name: DoodleName } & DoodleProps) {
  const Cmp = DOODLES[name];
  return <Cmp className={className} strokeWidth={strokeWidth} />;
}

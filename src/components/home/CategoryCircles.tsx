"use client";

import Link from "next/link";
import {
  Soup,
  CookingPot,
  Flame,
  Salad,
  Sandwich,
  Drumstick,
  Beef,
  Cookie,
  CupSoda,
  Utensils,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ScrollRow } from "./ScrollRow";

export type CategoryChip = { name: string; slug: string; count: number };

function iconFor(slug: string): LucideIcon {
  if (/momo/.test(slug)) return Soup;
  if (/curry/.test(slug)) return CookingPot;
  if (/chilli/.test(slug)) return Flame;
  if (/salad/.test(slug)) return Salad;
  if (/burger/.test(slug)) return Beef;
  if (/wing|strip/.test(slug)) return Drumstick;
  if (/shawarma|sandwich|donair/.test(slug)) return Sandwich;
  if (/family|platter/.test(slug)) return Users;
  if (/side/.test(slug)) return Cookie;
  if (/drink|tea/.test(slug)) return CupSoda;
  if (/noodle|chowmein|hakka|poutine|fries|combo/.test(slug)) return Utensils;
  return Utensils;
}

export function CategoryCircles({
  categories,
}: {
  categories: CategoryChip[];
}) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-forest-400">
              Explore the menu
            </p>
            <h2 className="mt-2 font-sans text-2xl font-medium tracking-tight text-forest-900 sm:text-3xl">
              Craving something delicious?
            </h2>
          </div>
          <Link
            href="/menu"
            className="hidden shrink-0 text-sm font-medium text-forest-600 underline-offset-4 hover:text-forest-800 hover:underline sm:inline"
          >
            Browse all &rarr;
          </Link>
        </div>

        <ScrollRow ariaLabel="Menu categories">
          {categories.map((cat) => {
            const Icon = iconFor(cat.slug);
            return (
              <Link
                key={cat.slug}
                href={`/menu#${cat.slug}`}
                className="group flex w-20 shrink-0 flex-col items-center gap-2.5 sm:w-24"
                style={{ scrollSnapAlign: "start" }}
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-50 text-forest-600 transition-colors group-hover:bg-forest-100 sm:h-20 sm:w-20">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <span className="text-center text-xs font-medium leading-tight text-forest-700">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </ScrollRow>
      </Container>
    </section>
  );
}

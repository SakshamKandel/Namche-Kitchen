import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { getCategoriesWithItems, type CategoryWithItems } from "@/lib/queries";
import { displayPrice, parseTags } from "@/lib/utils";

/** Preferred categories to surface (in order), falling back to the first three. */
const PREFERRED_SLUGS = ["momo", "curry-comforts", "shawarma-sandwiches"];
const ITEMS_PER_CATEGORY = 5;

function pickCategories(all: CategoryWithItems[]): CategoryWithItems[] {
  const withItems = all.filter((c) => c.items.length > 0);
  const chosen: CategoryWithItems[] = [];
  const used = new Set<string>();

  for (const slug of PREFERRED_SLUGS) {
    const match = withItems.find((c) => c.slug === slug);
    if (match) {
      chosen.push(match);
      used.add(match.id);
    }
  }
  for (const c of withItems) {
    if (chosen.length >= 3) break;
    if (!used.has(c.id)) chosen.push(c);
  }
  return chosen.slice(0, 3);
}

function MenuLine({ item }: { item: CategoryWithItems["items"][number] }) {
  const price = displayPrice(item);
  const tags = parseTags(item.tags).slice(0, 3);

  return (
    <li className="py-3 first:pt-0">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="font-display text-lg font-medium text-forest-900">
          {item.name}
        </span>
        <span
          aria-hidden
          className="mx-3 hidden flex-1 translate-y-[-0.2em] border-b border-dotted border-sand-400/70 sm:block"
        />
        {price && (
          <span className="ml-auto shrink-0 font-display text-base tabular-nums text-clay-600 sm:ml-0">
            {price}
          </span>
        )}
      </div>
      {item.description && (
        <p className="mt-1 text-sm leading-relaxed text-forest-600">
          {item.description}
        </p>
      )}
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-sand-300 bg-sand-100 px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-clay-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </li>
  );
}

export async function MenuPreview() {
  const categories = await getCategoriesWithItems({ onlyAvailable: true });
  const picked = pickCategories(categories);

  if (picked.length === 0) return null;

  return (
    <section className="bg-paper border-y border-sand-300 bg-cream-100 py-20 text-forest-800 sm:py-28">
      <Container>
        <Reveal className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-clay-500">
            The menu
          </span>
          <span className="mt-5 block h-px w-12 bg-clay-400" />
          <h2 className="mt-5 text-balance font-display text-4xl font-medium tracking-tight text-forest-900 sm:text-5xl">
            A taste of the table
          </h2>
          <p className="mt-4 text-pretty text-forest-600">
            A small selection from the kitchen — hand-folded, made to order, and
            served with the spices we grew up on.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
          {picked.map((category, i) => {
            const thumb = category.items.find((it) => it.imageUrl)?.imageUrl;
            return (
              <Reveal
                key={category.id}
                delay={i * 0.08}
                className={
                  i === 2 ? "md:col-span-2 md:mx-auto md:w-[calc(50%-1rem)]" : undefined
                }
              >
                <div className="h-full rounded-3xl border border-sand-300 bg-cream-50 p-7 shadow-warm sm:p-8">
                  <div className="flex items-center gap-4">
                    {thumb && (
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-sand-300">
                        <Image
                          src={thumb}
                          alt={category.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-display text-2xl font-medium text-forest-900">
                        {category.name}
                      </h3>
                      {category.tagline && (
                        <span className="mt-0.5 block truncate text-xs uppercase tracking-[0.16em] text-clay-500">
                          {category.tagline}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="mt-5 block h-px w-full bg-sand-300" />
                  <ul className="mt-4 divide-y divide-sand-200">
                    {category.items.slice(0, ITEMS_PER_CATEGORY).map((item) => (
                      <MenuLine key={item.id} item={item} />
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1} className="mt-16 flex justify-center">
          <Link
            href="/menu"
            className={buttonClasses({
              variant: "gold",
              size: "lg",
              className: "group",
            })}
          >
            View the full menu
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}

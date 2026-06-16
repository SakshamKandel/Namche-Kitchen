import { unstable_noStore as noStore } from "next/cache";
import type { Category, MenuItem } from "@prisma/client";
import { prisma } from "./db";

/* ------------------------------------------------------------------ */
/* Fallback dummy menu                                                 */
/* Used automatically when the database is unreachable / not yet       */
/* configured, so the public site always renders instead of crashing.  */
/* ------------------------------------------------------------------ */
type CategoryWithItemsT = Category & { items: MenuItem[] };
const EPOCH = new Date(0);

function mkItem(
  categoryId: string,
  sortOrder: number,
  o: Partial<MenuItem> & { name: string }
): MenuItem {
  return {
    id: `${categoryId}-${sortOrder}`,
    name: o.name,
    description: o.description ?? null,
    price: o.price ?? null,
    priceLabel: o.priceLabel ?? null,
    imageUrl: o.imageUrl ?? null,
    options: o.options ?? null,
    tags: o.tags ?? null,
    spiceLevel: o.spiceLevel ?? 0,
    featured: o.featured ?? false,
    available: true,
    sortOrder,
    categoryId,
    createdAt: EPOCH,
    updatedAt: EPOCH,
  };
}

function mkCategory(
  i: number,
  name: string,
  slug: string,
  tagline: string,
  items: (Partial<MenuItem> & { name: string })[]
): CategoryWithItemsT {
  return {
    id: slug,
    name,
    slug,
    tagline,
    sortOrder: i,
    createdAt: EPOCH,
    updatedAt: EPOCH,
    items: items.map((it, idx) => mkItem(slug, idx, it)),
  };
}

const FALLBACK_MENU: CategoryWithItemsT[] = [
  mkCategory(0, "Momo", "momo", "Hand-folded Himalayan dumplings", [
    { name: "Steam Momo", description: "Ten steamed dumplings with house achar.", price: 13.99, options: "Chicken / Veg", tags: "popular", featured: true },
    { name: "Veg Momo", description: "Garden-vegetable dumplings, steamed to order.", price: 12.99, tags: "vegetarian" },
    { name: "Chilli Momo", description: "Wok-tossed in a sweet-and-spicy chilli glaze.", price: 15.49, tags: "spicy", spiceLevel: 2 },
  ]),
  mkCategory(1, "Chowmein", "chowmein", "Wok-tossed noodles", [
    { name: "Chicken Chowmein", description: "Classic Nepali-style stir-fried noodles.", price: 13.49, tags: "popular", featured: true },
    { name: "Veg Chowmein", description: "Seasonal vegetables tossed through noodles.", price: 11.99, tags: "vegetarian" },
  ]),
  mkCategory(2, "Curry Comforts", "curry", "Slow-simmered curries with rice or naan", [
    { name: "Butter Chicken", description: "Tandoori chicken in a velvety tomato-butter gravy.", price: 16.99, tags: "popular", featured: true },
    { name: "Chana Masala", description: "Chickpeas in a tangy, fragrant masala.", price: 14.49, tags: "vegan, vegetarian" },
  ]),
  mkCategory(3, "Shawarma", "shawarma", "Wrapped fresh — always halal", [
    { name: "Chicken Shawarma", description: "Marinated chicken, garlic sauce, pickles in a warm wrap.", priceLabel: "Small $8.99 / Large $11.99", tags: "halal", featured: true },
    { name: "Falafel Wrap", description: "Crispy falafel, hummus and fresh salad.", priceLabel: "Small $8.99 / Large $10.99", tags: "halal, vegan, vegetarian" },
  ]),
  mkCategory(4, "Drinks", "drinks", "Brewed and poured", [
    { name: "Masala Tea", description: "Spiced Himalayan milk tea.", price: 3.49, tags: "vegetarian" },
    { name: "Canned Pop", description: "Coke, Diet Coke, Sprite or Fanta.", price: 2.49 },
  ]),
];

/** Categories (sorted) with their items. Falls back to a dummy menu on error. */
export async function getCategoriesWithItems(opts?: {
  onlyAvailable?: boolean;
}): Promise<CategoryWithItemsT[]> {
  noStore();
  try {
    const cats = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        items: {
          where: opts?.onlyAvailable ? { available: true } : undefined,
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        },
      },
    });
    return cats.length > 0 ? cats : FALLBACK_MENU;
  } catch (err) {
    console.error("[queries] getCategoriesWithItems failed — using fallback menu:", err);
    return FALLBACK_MENU;
  }
}

/** Featured dishes for the home page. Falls back to dummy featured on error. */
export async function getFeaturedItems(limit = 6) {
  noStore();
  try {
    const items = await prisma.menuItem.findMany({
      where: { featured: true, available: true },
      orderBy: { sortOrder: "asc" },
      take: limit,
      include: { category: true },
    });
    if (items.length > 0) return items;
  } catch (err) {
    console.error("[queries] getFeaturedItems failed — using fallback:", err);
  }
  // Derive featured from the fallback menu so the home page still populates.
  return FALLBACK_MENU.flatMap((c) =>
    c.items
      .filter((i) => i.featured)
      .map((i) => ({ ...i, category: { ...c, items: [] } as Category }))
  ).slice(0, limit);
}

export async function getReservations() {
  noStore();
  try {
    return await prisma.reservation.findMany({ orderBy: { createdAt: "desc" } });
  } catch (err) {
    console.error("[queries] getReservations failed:", err);
    return [];
  }
}

export async function getCateringInquiries() {
  noStore();
  try {
    return await prisma.cateringInquiry.findMany({ orderBy: { createdAt: "desc" } });
  } catch (err) {
    console.error("[queries] getCateringInquiries failed:", err);
    return [];
  }
}

export async function getAdminStats() {
  noStore();
  try {
    const [reservations, pending, catering, items, categories, subscribers] =
      await Promise.all([
        prisma.reservation.count(),
        prisma.reservation.count({ where: { status: "pending" } }),
        prisma.cateringInquiry.count({ where: { status: "new" } }),
        prisma.menuItem.count(),
        prisma.category.count(),
        prisma.newsletterSubscriber.count(),
      ]);
    return { reservations, pending, catering, items, categories, subscribers };
  } catch (err) {
    console.error("[queries] getAdminStats failed:", err);
    return { reservations: 0, pending: 0, catering: 0, items: 0, categories: 0, subscribers: 0 };
  }
}

export type CategoryWithItems = CategoryWithItemsT;
export type MenuItemRecord = CategoryWithItems["items"][number];

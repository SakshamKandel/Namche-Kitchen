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
  mkCategory(0, "Momo (10 Pcs)", "momo", "Hand-folded Himalayan dumplings", [
    { name: "Steam Momo", description: "Seasoned chicken with our homemade sauce and spicy chili dip.", price: 14.99, options: "Chicken / Vegetarian", tags: "popular", featured: true },
    { name: "Pan Fried Momo", description: "Crispy pan-fried momo with house-made sauce and chili dip.", price: 15.49, options: "Chicken / Vegetarian" },
    { name: "Chilli Momo", description: "Chili-tossed momo with pepper, onion and tomato sauce.", price: 16.49, tags: "spicy", spiceLevel: 2 },
  ]),
  mkCategory(1, "Chowmein", "chowmein", "Nepali-style stir-fried noodles", [
    { name: "Chicken Chowmein", description: "Classic Nepali chowmein with tender chicken.", price: 15.49, tags: "spicy", spiceLevel: 2, featured: true },
    { name: "Veg Chowmein", description: "Chowmein with seasonal vegetables.", price: 13.49, tags: "vegetarian, spicy", spiceLevel: 2 },
  ]),
  mkCategory(2, "Curry Comforts", "curry-comforts", "Served with rice or naan", [
    { name: "Butter Chicken", description: "Tender chicken in a velvety, spiced butter sauce.", price: 19.95, tags: "popular", featured: true },
    { name: "Butter Paneer", description: "Creamy tomato-based curry with soft paneer.", price: 19.95, tags: "vegetarian" },
  ]),
  mkCategory(3, "Shawarma", "shawarma-sandwiches", "Wrapped fresh — always halal", [
    { name: "Chicken Shawarma", description: "Chicken, garlic sauce, pickles and veg in a warm wrap.", priceLabel: "Small $9.99 / Large $13.99", tags: "halal", featured: true },
    { name: "Falafel", description: "Crispy chickpea falafel wrap.", priceLabel: "Small $8.99 / Large $13.99", tags: "halal, vegan, vegetarian" },
  ]),
  mkCategory(4, "Masala Tea & Drinks", "drinks", "Brewed and poured", [
    { name: "Milk Masala Tea", description: "Spiced Himalayan milk tea.", price: 3.49 },
    { name: "Can Drink", description: "Assorted canned soft drinks.", price: 2.49 },
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

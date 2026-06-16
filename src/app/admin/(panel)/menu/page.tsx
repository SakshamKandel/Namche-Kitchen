import type { Metadata } from "next";
import { getCategoriesWithItems } from "@/lib/queries";
import { MenuManager } from "@/components/admin/MenuManager";
import type { AdminCategory } from "@/components/admin/MenuManager";

export const metadata: Metadata = {
  title: "Menu Manager — Namche Kitchen Admin",
  description: "Create, edit, and organise menu categories and dishes.",
};

export default async function AdminMenuPage() {
  const raw = await getCategoriesWithItems();

  // Serialise to a plain shape — no Date objects cross the server→client boundary.
  const categories: AdminCategory[] = raw.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    tagline: cat.tagline ?? null,
    sortOrder: cat.sortOrder,
    items: cat.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description ?? null,
      price: item.price ?? null,
      priceLabel: item.priceLabel ?? null,
      imageUrl: item.imageUrl ?? null,
      options: item.options ?? null,
      tags: item.tags ?? null,
      spiceLevel: item.spiceLevel ?? 0,
      featured: item.featured,
      available: item.available,
      sortOrder: item.sortOrder,
      categoryId: item.categoryId,
    })),
  }));

  return <MenuManager initialCategories={categories} />;
}

import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "./db";

/** Categories (sorted) with their items. Used by the public menu + admin. */
export async function getCategoriesWithItems(opts?: {
  onlyAvailable?: boolean;
}) {
  noStore();
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      items: {
        where: opts?.onlyAvailable ? { available: true } : undefined,
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      },
    },
  });
}

/** Featured dishes for the home page. */
export async function getFeaturedItems(limit = 6) {
  noStore();
  return prisma.menuItem.findMany({
    where: { featured: true, available: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
    include: { category: true },
  });
}

export async function getReservations() {
  noStore();
  return prisma.reservation.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getCateringInquiries() {
  noStore();
  return prisma.cateringInquiry.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getAdminStats() {
  noStore();
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
}

export type CategoryWithItems = Awaited<
  ReturnType<typeof getCategoriesWithItems>
>[number];
export type MenuItemRecord = CategoryWithItems["items"][number];

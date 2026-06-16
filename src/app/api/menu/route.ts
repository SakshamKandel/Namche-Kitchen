import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { menuItemSchema } from "@/lib/validation";
import { requireAdmin, readJson, badRequest } from "@/lib/api";

// All menu items (with category).
export async function GET() {
  const items = await prisma.menuItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { category: true },
  });
  return NextResponse.json({ items });
}

// Admin: create a menu item.
export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const body = await readJson(req);
  const parsed = menuItemSchema.safeParse(body);
  if (!parsed.success) return badRequest("Please check the form", parsed.error.issues);

  const d = parsed.data;
  const count = await prisma.menuItem.count({
    where: { categoryId: d.categoryId },
  });

  const item = await prisma.menuItem.create({
    data: {
      name: d.name,
      description: d.description ?? null,
      price: d.price ?? null,
      priceLabel: d.priceLabel ?? null,
      imageUrl: d.imageUrl ?? null,
      options: d.options ?? null,
      tags: d.tags ?? null,
      spiceLevel: d.spiceLevel ?? 0,
      categoryId: d.categoryId,
      featured: d.featured ?? false,
      available: d.available ?? true,
      sortOrder: d.sortOrder ?? count,
    },
  });
  return NextResponse.json({ ok: true, item }, { status: 201 });
}

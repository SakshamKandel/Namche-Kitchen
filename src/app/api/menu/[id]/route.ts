import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { menuItemUpdateSchema } from "@/lib/validation";
import { requireAdmin, readJson, badRequest } from "@/lib/api";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const body = await readJson(req);
  const parsed = menuItemUpdateSchema.safeParse(body);
  if (!parsed.success) return badRequest("Invalid data", parsed.error.issues);

  const d = parsed.data;
  const item = await prisma.menuItem.update({
    where: { id },
    data: {
      ...(d.name !== undefined ? { name: d.name } : {}),
      ...(d.description !== undefined ? { description: d.description ?? null } : {}),
      ...(d.price !== undefined ? { price: d.price ?? null } : {}),
      ...(d.priceLabel !== undefined ? { priceLabel: d.priceLabel ?? null } : {}),
      ...(d.imageUrl !== undefined ? { imageUrl: d.imageUrl ?? null } : {}),
      ...(d.options !== undefined ? { options: d.options ?? null } : {}),
      ...(d.tags !== undefined ? { tags: d.tags ?? null } : {}),
      ...(d.spiceLevel !== undefined ? { spiceLevel: d.spiceLevel } : {}),
      ...(d.categoryId !== undefined ? { categoryId: d.categoryId } : {}),
      ...(d.featured !== undefined ? { featured: d.featured } : {}),
      ...(d.available !== undefined ? { available: d.available } : {}),
      ...(d.sortOrder !== undefined ? { sortOrder: d.sortOrder } : {}),
    },
  });
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  await prisma.menuItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

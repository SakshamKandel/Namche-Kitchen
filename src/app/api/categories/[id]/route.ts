import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { categorySchema } from "@/lib/validation";
import { requireAdmin, readJson, badRequest } from "@/lib/api";
import { slugify } from "@/lib/utils";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const body = await readJson(req);
  const parsed = categorySchema.partial().safeParse(body);
  if (!parsed.success) return badRequest("Invalid data", parsed.error.issues);

  const data = parsed.data;
  const category = await prisma.category.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.slug !== undefined ? { slug: slugify(data.slug) } : {}),
      ...(data.tagline !== undefined ? { tagline: data.tagline ?? null } : {}),
      ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
    },
  });
  return NextResponse.json({ ok: true, category });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

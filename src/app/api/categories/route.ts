import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { categorySchema } from "@/lib/validation";
import { requireAdmin, readJson, badRequest } from "@/lib/api";
import { slugify } from "@/lib/utils";

// Categories with their items (used by the admin menu manager).
export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      items: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] },
    },
  });
  return NextResponse.json({ categories });
}

// Admin: create a category.
export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const body = await readJson(req);
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) return badRequest("Please check the form", parsed.error.issues);

  const data = parsed.data;
  let slug = data.slug ? slugify(data.slug) : slugify(data.name);

  // Ensure slug uniqueness.
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

  const count = await prisma.category.count();
  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug,
      tagline: data.tagline ?? null,
      sortOrder: data.sortOrder ?? count,
    },
  });
  return NextResponse.json({ ok: true, category }, { status: 201 });
}

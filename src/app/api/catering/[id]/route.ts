import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cateringStatusSchema } from "@/lib/validation";
import { requireAdmin, readJson, badRequest } from "@/lib/api";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const body = await readJson(req);
  const parsed = cateringStatusSchema.safeParse(body);
  if (!parsed.success) return badRequest("Invalid status", parsed.error.issues);

  const inquiry = await prisma.cateringInquiry.update({
    where: { id },
    data: { status: parsed.data.status },
  });
  return NextResponse.json({ ok: true, inquiry });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  await prisma.cateringInquiry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

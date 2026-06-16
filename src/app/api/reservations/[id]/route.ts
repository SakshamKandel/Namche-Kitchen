import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { reservationStatusSchema } from "@/lib/validation";
import { requireAdmin, readJson, badRequest } from "@/lib/api";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const body = await readJson(req);
  const parsed = reservationStatusSchema.safeParse(body);
  if (!parsed.success) return badRequest("Invalid status", parsed.error.issues);

  const reservation = await prisma.reservation.update({
    where: { id },
    data: { status: parsed.data.status },
  });
  return NextResponse.json({ ok: true, reservation });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  await prisma.reservation.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

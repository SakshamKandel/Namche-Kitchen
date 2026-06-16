import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { reservationSchema } from "@/lib/validation";
import { requireAdmin, readJson, badRequest } from "@/lib/api";

// Public: submit a reservation request.
export async function POST(req: Request) {
  const body = await readJson(req);
  const parsed = reservationSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest("Please check the form", parsed.error.issues);
  }
  const d = parsed.data;
  const reservation = await prisma.reservation.create({
    data: {
      name: d.name,
      email: d.email,
      phone: d.phone,
      date: new Date(d.date),
      time: d.time,
      partySize: d.partySize,
      notes: d.notes ?? null,
    },
  });
  return NextResponse.json({ ok: true, id: reservation.id }, { status: 201 });
}

// Admin: list reservations.
export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ reservations });
}

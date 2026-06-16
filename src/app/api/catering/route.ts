import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cateringSchema } from "@/lib/validation";
import { requireAdmin, readJson, badRequest } from "@/lib/api";

// Public: submit a catering enquiry.
export async function POST(req: Request) {
  const body = await readJson(req);
  const parsed = cateringSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest("Please check the form", parsed.error.issues);
  }
  const d = parsed.data;
  const inquiry = await prisma.cateringInquiry.create({
    data: {
      name: d.name,
      email: d.email,
      phone: d.phone,
      eventDate: d.eventDate ? new Date(d.eventDate) : null,
      eventType: d.eventType ?? null,
      guestCount: d.guestCount ?? null,
      message: d.message ?? null,
    },
  });
  return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
}

// Admin: list catering enquiries.
export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const inquiries = await prisma.cateringInquiry.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ inquiries });
}

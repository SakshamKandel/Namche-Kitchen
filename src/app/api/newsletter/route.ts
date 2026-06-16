import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { newsletterSchema } from "@/lib/validation";
import { requireAdmin, readJson, badRequest } from "@/lib/api";

// Public: subscribe to the newsletter (idempotent on email).
export async function POST(req: Request) {
  const body = await readJson(req);
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest("Please enter a valid email", parsed.error.issues);
  }
  const data = parsed.data;
  const email = data.email.trim().toLowerCase();
  await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: {},
    create: { email, source: data.source ?? null },
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}

// Admin: list subscribers.
export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ subscribers });
}

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validation";
import { readJson, badRequest } from "@/lib/api";
import { createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await readJson(req);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return badRequest("Enter your email and password");

  const { email, password } = parsed.data;
  const user = await prisma.adminUser.findUnique({ where: { email } });

  // Constant-ish failure to avoid leaking which part was wrong.
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const token = await createSessionToken({ userId: user.id, email: user.email });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { getCurrentAdmin, type SessionPayload } from "./auth";

type AdminGuard =
  | { ok: true; admin: SessionPayload }
  | { ok: false; response: NextResponse };

/** Use at the top of admin-only route handlers. */
export async function requireAdmin(): Promise<AdminGuard> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { ok: true, admin };
}

export async function readJson(req: Request): Promise<unknown> {
  return req.json().catch(() => null);
}

export function badRequest(message: string, issues?: unknown) {
  return NextResponse.json({ error: message, issues }, { status: 400 });
}

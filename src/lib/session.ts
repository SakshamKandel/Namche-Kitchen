/**
 * Edge-safe session primitives (no `next/headers`). Imported by both the
 * middleware (Edge runtime) and the server-only auth helpers.
 */
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "nk_admin";

const secretKey = process.env.AUTH_SECRET || "namche-dev-secret";
const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = {
  userId: string;
  email: string;
};

export async function createSessionToken(
  payload: SessionPayload
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function verifySessionToken(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    if (typeof payload.userId !== "string" || typeof payload.email !== "string")
      return null;
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}

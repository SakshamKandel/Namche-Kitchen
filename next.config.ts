import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

/**
 * Config is phase-aware so the dev server and a production `next build` never
 * share the same output directory. `next dev` writes to `.next-dev`, while
 * `next build` / `next start` keep using the default `.next`. This prevents a
 * concurrent build from corrupting the dev cache (the cause of intermittent
 * "Internal Server Error" / "Cannot read properties of undefined (reading
 * '/_app')" failures).
 */
export default function config(phase: string): NextConfig {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    distDir: isDev ? ".next-dev" : ".next",
    images: {
      remotePatterns: [
        { protocol: "https", hostname: "images.unsplash.com" },
        { protocol: "https", hostname: "**.namchekitchen.ca" },
      ],
    },
    experimental: {
      serverActions: {
        bodySizeLimit: "8mb",
      },
    },
  };
}

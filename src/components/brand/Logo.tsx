import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Namche Kitchen brand logo (public/logo.png — white mountain + wordmark).
 *
 * The artwork is a single white colour on transparency, so we render it as a
 * CSS mask filled with `currentColor`. That means it recolours to match any
 * background and stays visible everywhere: deep forest on light surfaces,
 * cream on dark surfaces. Set the size with a height class via `className`.
 */
export function Logo({
  className,
  tone = "forest",
  href = "/",
}: {
  className?: string;
  tone?: "forest" | "cream";
  href?: string | null;
}) {
  const content = (
    <span
      role="img"
      aria-label="Namche Kitchen"
      className={cn(
        "inline-block h-11 w-[3.4rem] bg-current align-middle",
        tone === "cream" ? "text-cream-50" : "text-forest-800",
        className
      )}
      style={{
        aspectRatio: "768 / 640",
        WebkitMaskImage: "url(/logo.png)",
        maskImage: "url(/logo.png)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );

  if (href === null) return content;
  return (
    <Link href={href} className="inline-flex" aria-label="Namche Kitchen — home">
      {content}
    </Link>
  );
}

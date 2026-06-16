import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { buttonClasses } from "@/components/ui/Button";
import { DoodleScatter } from "@/components/decor/DoodleScatter";
import { Doodle } from "@/components/decor/FoodDoodles";

export const metadata: Metadata = {
  title: "Page not found",
  description: `The page you were looking for isn't on the menu. Head back to ${SITE.name} or explore our dishes.`,
};

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-screen flex-col items-center justify-center bg-cream-50 px-6 text-center">
      <DoodleScatter preset="rich" />

      <div className="flex flex-col items-center gap-6">
        <Doodle name="momo" className="h-16 w-16 text-forest-300" />

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-400">
          Error 404
        </p>

        <h1 className="max-w-2xl text-balance font-display text-4xl font-semibold leading-[1.1] tracking-tight text-forest-900 sm:text-5xl">
          Looks like this dish
          <br className="hidden sm:block" /> is off the menu
        </h1>

        <p className="max-w-md text-pretty text-base leading-relaxed text-forest-600/80">
          We couldn&rsquo;t find the page you were after — it may have moved or
          never existed. Let&rsquo;s get you back to something warm.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/" className={buttonClasses({ variant: "forest", size: "lg" })}>
            Back home
          </Link>
          <Link
            href="/menu"
            className={buttonClasses({ variant: "outline", size: "lg" })}
          >
            View the menu
          </Link>
        </div>
      </div>
    </main>
  );
}

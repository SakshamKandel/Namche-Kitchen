import Link from "next/link";
import { OrderButton } from "./OrderButton";
import { buttonClasses } from "@/components/ui/Button";

/**
 * Fixed bottom Order / Book action bar for phones. Hidden on md+.
 * Respects the iOS home-indicator safe area.
 */
export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-200 bg-cream-50/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <div className="flex items-center gap-3">
        <OrderButton variant="gold" size="md" className="flex-1" />
        <Link
          href="/reservations"
          className={buttonClasses({
            variant: "outline",
            size: "md",
            className: "flex-1",
          })}
        >
          Book a Table
        </Link>
      </div>
    </div>
  );
}

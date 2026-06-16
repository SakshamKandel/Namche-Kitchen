import { ShoppingBag } from "lucide-react";
import { SITE } from "@/lib/constants";
import {
  buttonClasses,
  type ButtonVariant,
  type ButtonSize,
} from "@/components/ui/Button";

/**
 * The "Order Online" call to action. Deep-links to the external ordering
 * portal (online.namchekitchen.ca) in a new tab.
 */
export function OrderButton({
  variant = "forest",
  size = "md",
  label = "Order Online",
  showIcon = true,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label?: string;
  showIcon?: boolean;
  className?: string;
}) {
  return (
    <a
      href={SITE.orderUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClasses({ variant, size, className })}
    >
      {showIcon && <ShoppingBag className="h-[1.05em] w-[1.05em]" />}
      {label}
    </a>
  );
}

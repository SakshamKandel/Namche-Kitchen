import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "forest"
  | "gold"
  | "outline"
  | "ghost"
  | "cream";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-300 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

const variants: Record<ButtonVariant, string> = {
  forest:
    "bg-forest-800 text-cream-50 hover:bg-forest-900",
  gold: "bg-gold-400 text-forest-900 hover:bg-gold-300",
  outline:
    "border border-cream-300 text-forest-800 hover:bg-forest-50 hover:border-forest-200",
  ghost: "text-forest-600 hover:bg-forest-50",
  cream: "bg-cream-100 text-forest-800 hover:bg-cream-200",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-11 px-6 text-[0.95rem]",
};

export function buttonClasses(opts?: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const { variant = "forest", size = "md", className } = opts ?? {};
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant, size, className, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={buttonClasses({ variant, size, className })}
        {...props}
      />
    );
  }
);

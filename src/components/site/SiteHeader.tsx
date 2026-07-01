"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { OrderButton } from "./OrderButton";
import { OpenStatus } from "./OpenStatus";
import { NAV_LINKS } from "@/lib/constants";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                */
/* ------------------------------------------------------------------ */
const dropdownVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 26 },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.98,
    transition: { duration: 0.15 },
  },
};

const mobileDrawerVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 280, damping: 28 },
  },
  exit: { opacity: 0, y: -12, transition: { duration: 0.18 } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.06 },
  },
  exit: {
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 320, damping: 24 },
  },
  exit: { opacity: 0, x: -8, transition: { duration: 0.12 } },
};

/* ------------------------------------------------------------------ */

type DropdownItem = {
  id: string;
  name: string;
  imageUrl: string | null;
  price: number | null;
  priceLabel: string | null;
};

type DropdownCategory = {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  items: DropdownItem[];
};

export function SiteHeader({
  menuCategories,
}: {
  menuCategories: DropdownCategory[];
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        dropdownRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }
      setDropdownOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [dropdownOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-cream-50/90 backdrop-blur-md transition-all duration-300",
        scrolled
          ? "border-cream-200 shadow-[0_1px_12px_rgba(15,30,23,0.04)]"
          : "border-cream-200/60"
      )}
    >
      <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-6 px-5 sm:px-8">
        <Logo className="h-10" />

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isMenu = link.href === "/menu";
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            if (isMenu) {
              return (
                <div key={link.href} className="relative">
                  <button
                    ref={triggerRef}
                    onClick={() => setDropdownOpen((v) => !v)}
                    onMouseEnter={() => setDropdownOpen(true)}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 text-[0.8rem] font-medium uppercase tracking-[0.14em] transition-colors",
                      active || dropdownOpen
                        ? "text-forest-900"
                        : "text-forest-500 hover:text-forest-900"
                    )}
                  >
                    {link.label}
                    <motion.span
                      animate={{ rotate: dropdownOpen ? 180 : 0 }}
                      transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </motion.span>
                  </button>

                  {/* Menu dropdown — presented like a real menu */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        ref={dropdownRef}
                        onMouseLeave={() => setDropdownOpen(false)}
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute -left-4 top-full mt-3 w-[420px] overflow-hidden rounded-2xl border border-forest-800 bg-forest-900 p-6 text-cream-100 shadow-subtle"
                      >
                        <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-gold-400">
                          Our Menu
                        </p>
                        <div className="grid grid-cols-2 gap-x-5 gap-y-1">
                          {menuCategories.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/menu#${cat.slug}`}
                              onClick={() => setDropdownOpen(false)}
                              className="group flex items-baseline gap-2 rounded-md py-1.5 text-sm text-cream-200/80 transition-colors hover:text-cream-50"
                            >
                              <span className="font-display text-[0.95rem] tracking-tight">
                                {cat.name}
                              </span>
                              <span className="h-px flex-1 translate-y-[-0.15em] border-b border-dotted border-cream-100/15 transition-colors group-hover:border-gold-400/50" />
                            </Link>
                          ))}
                        </div>
                        <span className="mt-5 block h-px w-full bg-forest-800" />
                        <Link
                          href="/menu"
                          onClick={() => setDropdownOpen(false)}
                          className="mt-4 inline-flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold-400 transition-colors hover:text-gold-300"
                        >
                          View full menu
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <div key={link.href} className="relative">
                <Link
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 text-[0.8rem] font-medium uppercase tracking-[0.14em] transition-colors",
                    active
                      ? "text-forest-900"
                      : "text-forest-500 hover:text-forest-900"
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute bottom-0 left-3 right-3 h-px bg-gold-400"
                      transition={{ type: "spring" as const, stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <OpenStatus variant="pill" className="hidden xl:inline-flex" />
          <Link
            href="/reservations"
            className={buttonClasses({
              variant: "outline",
              size: "sm",
              className: "hidden lg:inline-flex",
            })}
          >
            Reserve
          </Link>
          <OrderButton
            variant="gold"
            size="sm"
            className="hidden sm:inline-flex"
          />

          <motion.button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            whileTap={{ scale: 0.92 }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-forest-700 transition-colors hover:bg-forest-50 md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={mobileDrawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-x-0 top-[4.25rem] z-40 border-b border-cream-200 bg-cream-50 px-5 pb-8 pt-4 md:hidden"
          >
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col"
            >
              {NAV_LINKS.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <motion.div key={link.href} variants={staggerItem}>
                    <Link
                      href={link.href}
                      className={cn(
                        "block border-b border-cream-200 py-3 text-base font-medium transition-colors",
                        active ? "text-forest-900" : "text-forest-600"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="activeNavMobile"
                          className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-gold-400"
                          transition={{ type: "spring" as const, stiffness: 380, damping: 30 }}
                        />
                      )}
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, type: "spring" as const, stiffness: 300, damping: 24 }}
              className="mt-5 flex flex-col gap-2"
            >
              <Link
                href="/reservations"
                className={buttonClasses({ variant: "outline", size: "md" })}
              >
                Book a Table
              </Link>
              <OrderButton variant="gold" size="md" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

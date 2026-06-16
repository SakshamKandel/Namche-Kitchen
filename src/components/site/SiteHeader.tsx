"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { OrderButton } from "./OrderButton";
import { OpenStatus } from "./OpenStatus";
import { NAV_LINKS } from "@/lib/constants";
import { buttonClasses } from "@/components/ui/Button";
import { cn, formatPrice } from "@/lib/utils";

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

  const allDropdownItems = menuCategories.flatMap((c) => c.items);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-cream-50/85 backdrop-blur-md transition-all duration-300",
        scrolled
          ? "border-cream-200 shadow-[0_1px_12px_rgba(15,30,23,0.04)]"
          : "border-transparent"
      )}
    >
      <nav className="mx-auto flex h-[4.25rem] max-w-7xl items-center gap-6 px-5 sm:px-8">
        <Logo />

        {/* Desktop nav */}
        <div className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => {
            const isMenu = link.href === "/menu";
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            if (isMenu) {
              return (
                <div key={link.href} className="relative">
                  <motion.button
                    ref={triggerRef}
                    onClick={() => setDropdownOpen((v) => !v)}
                    onMouseEnter={() => setDropdownOpen(true)}
                    whileHover={{ y: -1 }}
                    transition={{ type: "spring" as const, stiffness: 400, damping: 22 }}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors",
                      active || dropdownOpen
                        ? "text-forest-900"
                        : "text-forest-500 hover:text-forest-800"
                    )}
                  >
                    {link.label}
                    <motion.span
                      animate={{ rotate: dropdownOpen ? 180 : 0 }}
                      transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </motion.span>
                  </motion.button>

                  {/* Mega dropdown */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        ref={dropdownRef}
                        onMouseLeave={() => setDropdownOpen(false)}
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute -left-4 top-full mt-2 w-[640px] rounded-xl border border-cream-200 bg-white p-5 shadow-subtle"
                      >
                        <div className="flex gap-6">
                          {/* Categories column */}
                          <div className="flex w-40 shrink-0 flex-col gap-1">
                            <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-forest-400">
                              Categories
                            </p>
                            {menuCategories.map((cat) => (
                              <Link
                                key={cat.id}
                                href={`/menu#${cat.slug}`}
                                onClick={() => setDropdownOpen(false)}
                                className="rounded-md px-2.5 py-1.5 text-sm text-forest-600 transition-colors hover:bg-forest-50 hover:text-forest-900"
                              >
                                {cat.name}
                              </Link>
                            ))}
                            <Link
                              href="/menu"
                              onClick={() => setDropdownOpen(false)}
                              className="mt-2 inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm font-medium text-forest-800 transition-colors hover:bg-forest-50"
                            >
                              View full menu
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>

                          {/* Divider */}
                          <div className="w-px bg-cream-200" />

                          {/* Items grid */}
                          <div className="flex-1">
                            <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-wider text-forest-400">
                              Popular picks
                            </p>
                            <div className="grid grid-cols-3 gap-3">
                              {allDropdownItems.slice(0, 6).map((item) => (
                                <Link
                                  key={item.id}
                                  href="/menu"
                                  onClick={() => setDropdownOpen(false)}
                                  className="group flex flex-col gap-1.5 rounded-lg p-1.5 transition-colors hover:bg-cream-100"
                                >
                                  <div className="relative aspect-square overflow-hidden rounded-lg bg-forest-800">
                                    {item.imageUrl ? (
                                      <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        fill
                                        sizes="80px"
                                        className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center text-xs text-cream-200/40">
                                        No image
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-[0.75rem] font-medium leading-tight text-forest-900">
                                    {item.name}
                                  </p>
                                  {item.price != null && (
                                    <p className="text-[0.7rem] font-semibold text-forest-600">
                                      {formatPrice(item.price)}
                                    </p>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <motion.div
                key={link.href}
                whileHover={{ y: -1 }}
                transition={{ type: "spring" as const, stiffness: 400, damping: 22 }}
                className="relative"
              >
                <Link
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-forest-900"
                      : "text-forest-500 hover:text-forest-800"
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gold-400"
                      transition={{ type: "spring" as const, stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <OpenStatus variant="pill" className="hidden lg:inline-flex" />
          <OrderButton size="sm" className="hidden sm:inline-flex" />

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
              <OrderButton size="md" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

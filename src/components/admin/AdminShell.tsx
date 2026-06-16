"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CalendarDays,
  UtensilsCrossed,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import type { SessionPayload } from "@/lib/auth";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
};

const NAV: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    exact: true,
  },
  {
    href: "/admin/bookings",
    label: "Bookings",
    icon: <CalendarDays className="h-4 w-4" />,
  },
  {
    href: "/admin/menu",
    label: "Menu",
    icon: <UtensilsCrossed className="h-4 w-4" />,
  },
];

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const drawerVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0, transition: { type: "spring" as const, stiffness: 280, damping: 28 } },
  exit: { x: "-100%", transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 320, damping: 24 } },
};

export function AdminShell({
  admin,
  children,
}: {
  admin: SessionPayload;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
    }
  }

  function isActive(item: NavItem) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="border-b border-forest-800/40 px-6 py-5">
        <Logo tone="cream" href="/admin" />
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-forest-500">
          Navigation
        </p>
        {NAV.map((item) => {
          const active = isActive(item);
          return (
            <motion.div
              key={item.href}
              whileHover={{ x: 2 }}
              transition={{ type: "spring" as const, stiffness: 400, damping: 22 }}
            >
              <Link
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                  active
                    ? "bg-amber-400 text-forest-900"
                    : "text-slate-300 hover:bg-forest-800/50 hover:text-cream-50"
                )}
              >
                <span
                  className={cn(
                    "shrink-0 transition-colors",
                    active ? "text-forest-900" : "text-forest-400"
                  )}
                >
                  {item.icon}
                </span>
                {item.label}
                {active && (
                  <motion.span
                    layoutId="adminActiveNav"
                    className="ml-auto"
                    transition={{ type: "spring" as const, stiffness: 380, damping: 30 }}
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-forest-900/60" />
                  </motion.span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-forest-800/40 px-3 py-4 space-y-1">
        <motion.a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ x: 2 }}
          transition={{ type: "spring" as const, stiffness: 400, damping: 22 }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-forest-400 transition-colors hover:bg-forest-800/50 hover:text-cream-50"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          View site
        </motion.a>
        <motion.button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring" as const, stiffness: 400, damping: 22 }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-forest-400 transition-colors hover:bg-spice-600/15 hover:text-spice-300 disabled:opacity-50"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {loggingOut ? "Signing out…" : "Logout"}
        </motion.button>
        <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-forest-800/30 px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-400 text-xs font-bold text-forest-900">
            {admin.email.charAt(0).toUpperCase()}
          </div>
          <p className="truncate text-xs text-forest-300">{admin.email}</p>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col bg-forest-900 lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile overlay + drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-40 bg-forest-950/50 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-forest-900 lg:hidden"
            >
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.15 }}
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
                className="absolute -right-10 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-forest-800 text-cream-50 shadow-lg transition-colors hover:bg-forest-700"
              >
                <X className="h-4 w-4" />
              </motion.button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-forest-100 bg-cream-50 px-4 lg:hidden">
          <motion.button
            type="button"
            onClick={() => setSidebarOpen(true)}
            whileTap={{ scale: 0.92 }}
            aria-label="Open menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-forest-700 transition-colors hover:bg-forest-100"
          >
            <Menu className="h-5 w-5" />
          </motion.button>
          <Logo tone="forest" href="/admin" />
          <motion.button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            whileTap={{ scale: 0.92 }}
            aria-label="Logout"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-forest-500 transition-colors hover:bg-forest-100 disabled:opacity-50"
          >
            <LogOut className="h-5 w-5" />
          </motion.button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-cream-50 px-4 py-6 sm:px-8 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

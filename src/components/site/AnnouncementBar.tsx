"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Doodle } from "@/components/decor/FoodDoodles";
import { ANNOUNCEMENT } from "@/lib/constants";

const STORAGE_PREFIX = "namche-announce:";

/**
 * Slim promo bar shown above the header. Rotates through messages, can be
 * dismissed (persisted to localStorage under the announcement id), and is
 * SSR-safe — it stays hidden until mounted so dismissed guests never see a
 * flash of the bar.
 */
export function AnnouncementBar() {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(0);

  const messages = ANNOUNCEMENT.messages;
  const storageKey = STORAGE_PREFIX + ANNOUNCEMENT.id;

  useEffect(() => {
    setMounted(true);
    try {
      if (window.localStorage.getItem(storageKey) === "1") {
        setDismissed(true);
      }
    } catch {
      /* localStorage unavailable — show the bar */
    }
  }, [storageKey]);

  useEffect(() => {
    if (messages.length <= 1 || dismissed) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 4_500);
    return () => clearInterval(id);
  }, [messages.length, dismissed]);

  if (!ANNOUNCEMENT.enabled || !mounted || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(storageKey, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="relative bg-forest-900 text-cream-50">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-10 py-2 sm:px-12">
        <p className="flex flex-1 items-center justify-center gap-2 text-center text-xs sm:text-sm">
          <Doodle
            name="sparkle"
            className="h-3.5 w-3.5 shrink-0 text-gold-400"
            strokeWidth={1.75}
          />
          <span className="relative inline-flex min-h-[1.25em] items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {messages[index]}
              </motion.span>
            </AnimatePresence>
          </span>
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="absolute right-3 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-cream-200 transition-colors hover:bg-cream-50/10 hover:text-cream-50"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

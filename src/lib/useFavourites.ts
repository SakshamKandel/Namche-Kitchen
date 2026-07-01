"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "nk:favourites";
const CHANGE_EVENT = "nk:favourites-change";

/** Safely parse a JSON string[] from storage; ignore anything malformed. */
function parseStored(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === "string");
  } catch {
    return [];
  }
}

/**
 * localStorage-backed "favourite dishes" store.
 *
 * SSR-safe: state starts as an empty Set with ready=false; localStorage is only
 * read inside an effect on mount. Stays in sync across every hook instance on the
 * page (via a CustomEvent) and across browser tabs (via the "storage" event).
 */
export function useFavourites(): {
  favourites: Set<string>;
  isFavourite: (id: string) => boolean;
  toggle: (id: string) => void;
  count: number;
  ready: boolean;
} {
  const [favourites, setFavourites] = useState<Set<string>>(() => new Set());
  const [ready, setReady] = useState(false);

  // Mirror the latest set so toggle() can read current state without being
  // recreated on every change (keeps a stable callback identity).
  const favouritesRef = useRef(favourites);
  favouritesRef.current = favourites;

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Hydrate from localStorage.
    setFavourites(new Set(parseStored(window.localStorage.getItem(STORAGE_KEY))));
    setReady(true);

    // Cross-tab sync: another tab wrote to the same storage key.
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      setFavourites(new Set(parseStored(e.newValue)));
    };

    // Same-page sync: another hook instance toggled a favourite.
    const handleCustom = (e: Event) => {
      const detail = (e as CustomEvent<unknown>).detail;
      if (!Array.isArray(detail)) return;
      setFavourites(
        new Set(detail.filter((v): v is string => typeof v === "string")),
      );
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(CHANGE_EVENT, handleCustom as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(CHANGE_EVENT, handleCustom as EventListener);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const next = new Set(favouritesRef.current);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    setFavourites(next);

    if (typeof window !== "undefined") {
      const ids = [...next];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
      } catch {
        // Storage may be full or unavailable (e.g. private mode); keep in-memory state.
      }
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: ids }));
    }
  }, []);

  const isFavourite = useCallback(
    (id: string) => favourites.has(id),
    [favourites],
  );

  return {
    favourites,
    isFavourite,
    toggle,
    count: favourites.size,
    ready,
  };
}

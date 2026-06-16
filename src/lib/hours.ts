/**
 * Opening-hours helpers. Parses the human-readable `SITE.hours` strings
 * (e.g. "Mon – Thu" / "11:30 AM – 9:00 PM") into structured per-weekday
 * ranges and computes a live open/closed status. Pure functions — safe on
 * both the server and the client.
 */
import { SITE } from "./constants";

const DAY_INDEX: Record<string, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type DayRange = { open: number; close: number } | null;

/** Split on en-dash, em-dash or hyphen and trim both sides. */
function splitRange(input: string): [string, string] {
  const parts = input.split(/\s*[–—-]\s*/);
  return [parts[0]?.trim() ?? "", parts[1]?.trim() ?? parts[0]?.trim() ?? ""];
}

/** "11:30 AM" -> minutes since midnight (690). Returns null if unparseable. */
function parseClock(label: string): number | null {
  const m = label.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10) % 12;
  const min = parseInt(m[2], 10);
  if (/pm/i.test(m[3])) h += 12;
  return h * 60 + min;
}

function dayToIndex(label: string): number | null {
  const key = label.trim().toLowerCase().slice(0, 3);
  return key in DAY_INDEX ? DAY_INDEX[key] : null;
}

/** Per-weekday opening ranges, indexed 0 (Sun) … 6 (Sat). */
export function getWeeklyHours(): DayRange[] {
  const week: DayRange[] = [null, null, null, null, null, null, null];

  for (const row of SITE.hours) {
    const [startDay, endDay] = splitRange(row.days);
    const [openLabel, closeLabel] = splitRange(row.time);
    const open = parseClock(openLabel);
    const close = parseClock(closeLabel);
    const from = dayToIndex(startDay);
    const to = dayToIndex(endDay);
    if (open === null || close === null || from === null || to === null) continue;

    // Walk forward from `from` to `to`, wrapping across the week if needed.
    let d = from;
    for (let guard = 0; guard < 7; guard++) {
      week[d] = { open, close };
      if (d === to) break;
      d = (d + 1) % 7;
    }
  }

  return week;
}

function fmtClock(minutes: number): string {
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return m === 0 ? `${h12} ${ampm}` : `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export type OpenStatus = {
  open: boolean;
  /** True when open but within `closingSoonMins` of closing. */
  closingSoon: boolean;
  /** Short status sentence, e.g. "Open now · closes 9 PM". */
  label: string;
};

/**
 * Compute open/closed status for a given moment (defaults to now, in the
 * viewer's local time — fine for a local restaurant's nearby guests).
 */
export function getOpenStatus(now: Date, closingSoonMins = 45): OpenStatus {
  const week = getWeeklyHours();
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const today = week[day];

  if (today && mins >= today.open && mins < today.close) {
    const closingSoon = today.close - mins <= closingSoonMins;
    return {
      open: true,
      closingSoon,
      label: closingSoon
        ? `Closing soon · ${fmtClock(today.close)}`
        : `Open now · closes ${fmtClock(today.close)}`,
    };
  }

  // Opening later today?
  if (today && mins < today.open) {
    return { open: false, closingSoon: false, label: `Opens ${fmtClock(today.open)}` };
  }

  // Find the next day with hours.
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const range = week[d];
    if (range) {
      const when = i === 1 ? "tomorrow" : DAY_SHORT[d];
      return {
        open: false,
        closingSoon: false,
        label: `Closed · opens ${when} ${fmtClock(range.open)}`,
      };
    }
  }

  return { open: false, closingSoon: false, label: "Closed" };
}

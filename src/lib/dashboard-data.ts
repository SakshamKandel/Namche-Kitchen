import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "./db";

/* ------------------------------------------------------------------ */
/* Dashboard data layer                                                */
/* Single server function computing every figure on the admin home     */
/* page from real DB rows. Mirrors the defensive style of queries.ts:  */
/* wrap in try/catch and return a zeroed/empty default on any error so  */
/* the dashboard always renders.                                       */
/* ------------------------------------------------------------------ */

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

export type ReservationDay = {
  date: string; // ISO yyyy-mm-dd (local)
  label: string; // e.g. "Mon 12"
  count: number;
  covers: number;
};

export type UpcomingReservation = {
  id: string;
  name: string;
  date: Date;
  time: string;
  partySize: number;
  status: string;
};

export type DashboardData = {
  kpis: {
    totalReservations: number;
    reservationsTrendPct: number;
    coversThisWeek: number;
    coversTrendPct: number;
    pendingApprovals: number;
    cateringNew: number;
    cateringTrendPct: number;
    subscribers: number;
    subscribersThisWeek: number;
  };
  reservationsByDay: ReservationDay[];
  statusBreakdown: { pending: number; confirmed: number; cancelled: number };
  cateringPipeline: {
    new: number;
    contacted: number;
    booked: number;
    closed: number;
  };
  upcoming: UpcomingReservation[];
  topCategories: { name: string; count: number }[];
};

const EMPTY_DASHBOARD: DashboardData = {
  kpis: {
    totalReservations: 0,
    reservationsTrendPct: 0,
    coversThisWeek: 0,
    coversTrendPct: 0,
    pendingApprovals: 0,
    cateringNew: 0,
    cateringTrendPct: 0,
    subscribers: 0,
    subscribersThisWeek: 0,
  },
  reservationsByDay: [],
  statusBreakdown: { pending: 0, confirmed: 0, cancelled: 0 },
  cateringPipeline: { new: 0, contacted: 0, booked: 0, closed: 0 },
  upcoming: [],
  topCategories: [],
};

/** Integer % change of `current` vs `previous`. 0 when previous is 0. */
function pctChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

/** Local (server-timezone) yyyy-mm-dd key for day bucketing. */
function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** "Mon 12" style label for a given date. */
function dayLabel(d: Date): string {
  return `${WEEKDAY_LABELS[d.getDay()]} ${d.getDate()}`;
}

/** Midnight (local) of the given date. */
function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export async function getDashboardData(): Promise<DashboardData> {
  noStore();
  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - WEEK_MS);
    const twoWeeksAgo = new Date(now.getTime() - 2 * WEEK_MS);
    const todayStart = startOfDay(now);

    const [reservations, catering, subscribers, categories] = await Promise.all([
      prisma.reservation.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.cateringInquiry.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.newsletterSubscriber.findMany({ select: { createdAt: true } }),
      prisma.category.findMany({
        select: { name: true, _count: { select: { items: true } } },
      }),
    ]);

    /* ---- KPIs: reservations (volume by createdAt) ---- */
    const totalReservations = reservations.length;
    const reservationsThisWeek = reservations.filter(
      (r) => r.createdAt >= weekAgo
    ).length;
    const reservationsLastWeek = reservations.filter(
      (r) => r.createdAt >= twoWeeksAgo && r.createdAt < weekAgo
    ).length;
    const reservationsTrendPct = pctChange(
      reservationsThisWeek,
      reservationsLastWeek
    );

    /* ---- KPIs: covers (sum partySize by service date, non-cancelled) ---- */
    const isLive = (status: string) => status !== "cancelled";
    const coversThisWeek = reservations
      .filter((r) => isLive(r.status) && r.date >= weekAgo && r.date <= now)
      .reduce((sum, r) => sum + r.partySize, 0);
    const coversLastWeek = reservations
      .filter(
        (r) => isLive(r.status) && r.date >= twoWeeksAgo && r.date < weekAgo
      )
      .reduce((sum, r) => sum + r.partySize, 0);
    const coversTrendPct = pctChange(coversThisWeek, coversLastWeek);

    /* ---- KPIs: pending approvals (all-time live count) ---- */
    const pendingApprovals = reservations.filter(
      (r) => r.status === "pending"
    ).length;

    /* ---- KPIs: catering (new leads by createdAt) ---- */
    const cateringNew = catering.filter((c) => c.status === "new").length;
    const cateringThisWeek = catering.filter(
      (c) => c.createdAt >= weekAgo
    ).length;
    const cateringLastWeek = catering.filter(
      (c) => c.createdAt >= twoWeeksAgo && c.createdAt < weekAgo
    ).length;
    const cateringTrendPct = pctChange(cateringThisWeek, cateringLastWeek);

    /* ---- KPIs: subscribers (total + new this week) ---- */
    const subscribersTotal = subscribers.length;
    const subscribersThisWeek = subscribers.filter(
      (s) => s.createdAt >= weekAgo
    ).length;

    /* ---- reservationsByDay: last 14 days by service date ---- */
    const dayBuckets = new Map<string, ReservationDay>();
    const orderedKeys: string[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = startOfDay(new Date(now.getTime() - i * DAY_MS));
      const key = dayKey(d);
      orderedKeys.push(key);
      dayBuckets.set(key, {
        date: key,
        label: dayLabel(d),
        count: 0,
        covers: 0,
      });
    }
    for (const r of reservations) {
      if (!isLive(r.status)) continue;
      const key = dayKey(r.date);
      const bucket = dayBuckets.get(key);
      if (!bucket) continue;
      bucket.count += 1;
      bucket.covers += r.partySize;
    }
    const reservationsByDay = orderedKeys.map((k) => dayBuckets.get(k)!);

    /* ---- statusBreakdown (all reservations) ---- */
    const statusBreakdown = { pending: 0, confirmed: 0, cancelled: 0 };
    for (const r of reservations) {
      if (r.status === "pending") statusBreakdown.pending += 1;
      else if (r.status === "confirmed") statusBreakdown.confirmed += 1;
      else if (r.status === "cancelled") statusBreakdown.cancelled += 1;
    }

    /* ---- cateringPipeline (counts by status) ---- */
    const cateringPipeline = { new: 0, contacted: 0, booked: 0, closed: 0 };
    for (const c of catering) {
      if (c.status === "new") cateringPipeline.new += 1;
      else if (c.status === "contacted") cateringPipeline.contacted += 1;
      else if (c.status === "booked") cateringPipeline.booked += 1;
      else if (c.status === "closed") cateringPipeline.closed += 1;
    }

    /* ---- upcoming: next 6 (date >= today, non-cancelled), date asc ---- */
    const upcoming: UpcomingReservation[] = reservations
      .filter((r) => isLive(r.status) && r.date >= todayStart)
      .sort((a, b) => {
        const byDate = a.date.getTime() - b.date.getTime();
        if (byDate !== 0) return byDate;
        return a.time.localeCompare(b.time);
      })
      .slice(0, 6)
      .map((r) => ({
        id: r.id,
        name: r.name,
        date: r.date,
        time: r.time,
        partySize: r.partySize,
        status: r.status,
      }));

    /* ---- topCategories: top 5 by item count ---- */
    const topCategories = categories
      .map((c) => ({ name: c.name, count: c._count.items }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      kpis: {
        totalReservations,
        reservationsTrendPct,
        coversThisWeek,
        coversTrendPct,
        pendingApprovals,
        cateringNew,
        cateringTrendPct,
        subscribers: subscribersTotal,
        subscribersThisWeek,
      },
      reservationsByDay,
      statusBreakdown,
      cateringPipeline,
      upcoming,
      topCategories,
    };
  } catch (err) {
    console.error("[dashboard-data] getDashboardData failed:", err);
    return EMPTY_DASHBOARD;
  }
}

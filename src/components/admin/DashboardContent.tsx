"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Bell,
  CalendarCheck2,
  Clock3,
  ChefHat,
  Users,
  Mail,
  Plus,
  CalendarRange,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  UtensilsCrossed,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatDate } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/Button";
import type { DashboardData } from "@/lib/dashboard-data";

/* ── Animation variants ─────────────────────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 26 },
  },
};

/* ── Types ──────────────────────────────────────────────────────── */

type Resv = {
  id: string;
  name: string;
  date: Date;
  time: string;
  partySize: number;
  status: string;
};

type Cater = {
  id: string;
  name: string;
  eventType: string | null;
  eventDate: Date | null;
  guestCount: number | null;
  status: string;
};

type FeaturedItem = {
  id: string;
  name: string;
  price: number | null;
  priceLabel: string | null;
  imageUrl: string | null;
  category: string | null;
};

interface DashboardContentProps {
  data: DashboardData;
  recentReservations: Resv[];
  recentCatering: Cater[];
  featuredItems: FeaturedItem[];
}

/* ── Stat card ───────────────────────────────────────────────────── */

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  subValue?: string;
  accent?: "forest" | "gold" | "spice";
  /** Integer percentage change vs previous window. */
  trendPct?: number;
  /** When true, an increase is bad news (e.g. pending approvals). */
  invertTrendColor?: boolean;
};

function StatCard({
  icon,
  label,
  value,
  subValue,
  accent = "forest",
  trendPct,
  invertTrendColor = false,
}: StatCardProps) {
  const accentMap = {
    forest: { bg: "bg-forest-50", icon: "text-forest-600", ring: "ring-forest-200" },
    gold: { bg: "bg-gold-300/15", icon: "text-gold-600", ring: "ring-gold-200" },
    spice: { bg: "bg-spice-400/8", icon: "text-spice-500", ring: "ring-spice-200" },
  };
  const a = accentMap[accent];

  const hasTrend = typeof trendPct === "number";
  const up = (trendPct ?? 0) >= 0;
  const neutral = (trendPct ?? 0) === 0;
  // "good" determines green vs amber. For inverted cards, down is good.
  const good = invertTrendColor ? !up : up;
  const chipClass = neutral
    ? "bg-cream-200 text-forest-500"
    : good
      ? "bg-forest-100 text-forest-600"
      : "bg-spice-400/10 text-spice-500";

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{
        y: -3,
        transition: { type: "spring" as const, stiffness: 400, damping: 22 },
      }}
      className={`group relative flex flex-col gap-3 rounded-2xl border border-forest-100 bg-white/80 px-5 py-5 shadow-soft backdrop-blur-sm transition-shadow duration-300 hover:shadow-md ${a.ring} hover:ring-1`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${a.bg} ${a.icon} transition-transform duration-200 group-hover:scale-105`}
        >
          {icon}
        </div>
        {hasTrend && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${chipClass}`}
          >
            {neutral ? (
              "—"
            ) : (
              <>
                {up ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(trendPct ?? 0)}%
              </>
            )}
          </span>
        )}
      </div>
      <div>
        <p className="font-display text-2xl font-bold text-forest-900">{value}</p>
        <p className="mt-0.5 text-sm text-forest-500">{label}</p>
        {subValue && (
          <p className="mt-0.5 text-xs text-forest-400">{subValue}</p>
        )}
      </div>
    </motion.div>
  );
}

/* ── Status badge ─────────────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-gold-300/25 text-gold-700 border-gold-300/40",
    confirmed: "bg-forest-100 text-forest-700 border-forest-200",
    cancelled: "bg-spice-400/8 text-spice-600 border-spice-400/20",
    new: "bg-gold-300/25 text-gold-700 border-gold-300/40",
    contacted: "bg-forest-100 text-forest-700 border-forest-200",
    booked: "bg-forest-200 text-forest-800 border-forest-300",
    closed: "bg-cream-200 text-forest-400 border-forest-100",
  };
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${
        map[status] ?? "bg-cream-200 text-forest-500 border-forest-100"
      }`}
    >
      {status}
    </span>
  );
}

/* ── Chart colors ─────────────────────────────────────────────── */

const DONUT_COLORS = ["#fbbf24", "#22c55e", "#f87171"]; // amber, green, red
const GRID_STROKE = "#e7e2d6";
const AXIS_FILL = "#6b7d6e";

const tooltipStyle = {
  background: "#fffdf8",
  border: "1px solid #d8e0d6",
  borderRadius: 10,
  color: "#1f2d23",
  fontSize: 12,
  boxShadow: "0 4px 14px rgba(31,45,35,0.08)",
} as const;

/* ── Main component ───────────────────────────────────────────── */

export function DashboardContent({
  data,
  recentReservations,
  recentCatering,
  featuredItems,
}: DashboardContentProps) {
  const { kpis, reservationsByDay, statusBreakdown, cateringPipeline, upcoming } =
    data;

  const today = new Date();
  const greeting =
    today.getHours() < 12
      ? "Good morning"
      : today.getHours() < 18
        ? "Good afternoon"
        : "Good evening";
  const todayLabel = today.toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const needsAttention = kpis.pendingApprovals + kpis.cateringNew;

  const donutData = [
    { name: "Pending", value: statusBreakdown.pending },
    { name: "Confirmed", value: statusBreakdown.confirmed },
    { name: "Cancelled", value: statusBreakdown.cancelled },
  ];
  const donutTotal =
    statusBreakdown.pending + statusBreakdown.confirmed + statusBreakdown.cancelled;

  const coversToday = upcoming
    .filter((u) => {
      const d = u.date;
      return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
      );
    })
    .reduce((sum, u) => sum + u.partySize, 0);

  const openCatering = recentCatering.filter(
    (c) => c.status === "new" || c.status === "contacted"
  );

  const pipelinePills: { label: string; count: number; accent: "gold" | "forest" }[] =
    [
      { label: "New", count: cateringPipeline.new, accent: "gold" },
      { label: "Contacted", count: cateringPipeline.contacted, accent: "forest" },
      { label: "Booked", count: cateringPipeline.booked, accent: "forest" },
      { label: "Closed", count: cateringPipeline.closed, accent: "forest" },
    ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 className="font-display text-2xl font-bold text-forest-900">
            {greeting}
          </h1>
          <p className="mt-0.5 text-sm text-forest-500">{todayLabel}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/menu"
            className={buttonClasses({ variant: "gold", size: "sm" })}
          >
            <Plus className="h-4 w-4" />
            Add menu item
          </Link>
          <Link
            href="/admin/bookings"
            className={buttonClasses({ variant: "forest", size: "sm" })}
          >
            <CalendarRange className="h-4 w-4" />
            View bookings
          </Link>
          <Link
            href="/"
            target="_blank"
            className={buttonClasses({ variant: "outline", size: "sm" })}
          >
            <ExternalLink className="h-4 w-4" />
            View site
          </Link>

          <span
            className="relative inline-flex h-9 items-center gap-1.5 rounded-lg border border-forest-200 bg-white px-2.5 text-sm text-forest-600"
            title={`${kpis.pendingApprovals} pending reservations · ${kpis.cateringNew} new catering leads`}
          >
            <Bell className="h-4 w-4" />
            {needsAttention > 0 ? (
              <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-forest-800 px-1.5 text-[11px] font-semibold text-cream-50">
                {needsAttention}
              </span>
            ) : (
              <span className="text-xs text-forest-400">All clear</span>
            )}
          </span>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-800 text-xs font-bold text-cream-50">
            A
          </div>
        </div>
      </motion.div>

      {/* ── Attention banner ────────────────────────────────────── */}
      {needsAttention > 0 && (
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl border border-gold-300/40 bg-gold-300/10 px-5 py-3 text-sm text-forest-700"
        >
          <span className="font-medium text-forest-900">
            {needsAttention} {needsAttention === 1 ? "item needs" : "items need"} your
            attention
          </span>
          <span className="text-forest-500">
            {kpis.pendingApprovals} pending {kpis.pendingApprovals === 1 ? "reservation" : "reservations"} ·{" "}
            {kpis.cateringNew} new catering {kpis.cateringNew === 1 ? "lead" : "leads"}
          </span>
          <Link
            href="/admin/bookings"
            className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-gold-700 hover:text-gold-600"
          >
            Review now
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      )}

      {/* ── KPI cards ───────────────────────────────────────────── */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <StatCard
          icon={<CalendarCheck2 className="h-5 w-5" />}
          label="Reservations · this week"
          value={kpis.totalReservations}
          subValue="all-time total"
          accent="forest"
          trendPct={kpis.reservationsTrendPct}
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Covers · this week"
          value={kpis.coversThisWeek}
          subValue="guests booked"
          accent="gold"
          trendPct={kpis.coversTrendPct}
        />
        <StatCard
          icon={<Clock3 className="h-5 w-5" />}
          label="Pending approvals"
          value={kpis.pendingApprovals}
          subValue="awaiting confirmation"
          accent="spice"
          trendPct={0}
          invertTrendColor
        />
        <StatCard
          icon={<ChefHat className="h-5 w-5" />}
          label="Catering enquiries"
          value={kpis.cateringNew}
          subValue="new leads"
          accent="gold"
          trendPct={kpis.cateringTrendPct}
        />
        <StatCard
          icon={<Mail className="h-5 w-5" />}
          label="Subscribers"
          value={kpis.subscribers}
          subValue={
            kpis.subscribersThisWeek > 0
              ? `+${kpis.subscribersThisWeek} this week`
              : "no new this week"
          }
          accent="forest"
        />
      </section>

      {/* ── Charts row (balanced 3-col) ─────────────────────────── */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Covers area — last 14 days (spans 2) */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-forest-100 bg-white/80 p-5 shadow-soft backdrop-blur-sm lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-forest-900">
                Covers by day
              </h2>
              <p className="text-xs text-forest-400">
                Guests booked per service date
              </p>
            </div>
            <span className="rounded-md bg-forest-50 px-2 py-0.5 text-[11px] text-forest-500">
              Last 14 days
            </span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={reservationsByDay}
                margin={{ top: 6, right: 8, bottom: 0, left: -18 }}
              >
                <defs>
                  <linearGradient id="coversFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2f6b46" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#2f6b46" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: AXIS_FILL, fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: GRID_STROKE }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: AXIS_FILL, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={36}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "#1f2d23", fontWeight: 600 }}
                  formatter={(value) => [`${Number(value)} covers`, "Covers"]}
                />
                <Area
                  type="monotone"
                  dataKey="covers"
                  stroke="#2f6b46"
                  strokeWidth={2}
                  fill="url(#coversFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Status donut (1 col) */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-forest-100 bg-white/80 p-5 shadow-soft backdrop-blur-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-forest-900">
              Reservation status
            </h2>
            <span className="rounded-md bg-forest-50 px-2 py-0.5 text-[11px] text-forest-500">
              All bookings
            </span>
          </div>
          <div className="relative mx-auto h-44 w-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={76}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {donutData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-2xl font-bold text-forest-900">
                {donutTotal}
              </span>
              <span className="text-[11px] text-forest-400">total</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {donutData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: DONUT_COLORS[i] }}
                />
                <span className="text-sm text-forest-600">{d.name}</span>
                <span className="ml-auto text-sm font-semibold text-forest-900">
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Action band: upcoming + catering pipeline ───────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming reservations (spans 2) */}
        <motion.section variants={itemVariants} className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <h2 className="text-sm font-semibold text-forest-900">
                Upcoming reservations
              </h2>
              <span className="text-xs text-forest-400">
                {coversToday} {coversToday === 1 ? "cover" : "covers"} booked today
              </span>
            </div>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-1 text-xs font-medium text-gold-600 transition-colors hover:text-gold-500"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-forest-100 bg-white/80 shadow-soft">
            {upcoming.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-forest-400">
                No bookings ahead — enjoy the calm.
              </p>
            ) : (
              <div className="divide-y divide-forest-50">
                {upcoming.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-forest-50/30"
                  >
                    <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-forest-50 px-2 py-1.5 text-center">
                      <span className="text-[15px] font-bold leading-none text-forest-800">
                        {r.time}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-forest-900">
                        {r.name}
                      </p>
                      <p className="text-xs text-forest-500">
                        {formatDate(r.date)} · party of {r.partySize}
                      </p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.section>

        {/* Catering pipeline (1 col) */}
        <motion.section variants={itemVariants}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-forest-900">
              Catering pipeline
            </h2>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-1 text-xs font-medium text-gold-600 transition-colors hover:text-gold-500"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="rounded-2xl border border-forest-100 bg-white/80 p-4 shadow-soft">
            <div className="grid grid-cols-4 gap-2">
              {pipelinePills.map((p) => (
                <div
                  key={p.label}
                  className={`flex flex-col items-center rounded-xl px-1 py-2 ${
                    p.accent === "gold"
                      ? "bg-gold-300/15 text-gold-700"
                      : "bg-forest-50 text-forest-600"
                  }`}
                >
                  <span className="font-display text-lg font-bold">{p.count}</span>
                  <span className="text-[10px] uppercase tracking-wide">
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {openCatering.length === 0 ? (
                <p className="py-4 text-center text-sm text-forest-400">
                  No open catering leads.
                </p>
              ) : (
                openCatering.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 rounded-xl border border-forest-50 px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-forest-900">
                        {c.name}
                      </p>
                      <p className="truncate text-xs text-forest-500">
                        {c.eventType ?? "Event"}
                        {c.eventDate ? ` · ${formatDate(c.eventDate)}` : ""}
                        {c.guestCount ? ` · ${c.guestCount} guests` : ""}
                      </p>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.section>
      </div>

      {/* ── Featured dishes ─────────────────────────────────────── */}
      <motion.section variants={itemVariants}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-forest-900">
            Featured dishes
          </h2>
          <Link
            href="/admin/menu"
            className="inline-flex items-center gap-1 text-xs font-medium text-gold-600 transition-colors hover:text-gold-500"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {featuredItems.length === 0 ? (
          <div className="rounded-2xl border border-forest-100 bg-white/80 p-8 text-center text-sm text-forest-400 shadow-soft">
            No featured dishes yet. Mark items as featured in the menu manager.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredItems.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-forest-100 bg-white/80 shadow-soft transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-forest-100">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 300px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-forest-300">
                      <UtensilsCrossed className="h-8 w-8 opacity-30" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="truncate text-sm font-medium text-forest-900">
                    {item.name}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs text-forest-400">
                      {item.category ?? "Menu"}
                    </span>
                    <span className="text-sm font-semibold text-forest-700">
                      {item.price != null
                        ? `$${item.price.toFixed(2)}`
                        : item.priceLabel ?? "—"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* ── Recent reservations + catering ──────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.section variants={itemVariants}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-forest-900">
              Recent reservations
            </h2>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-1 text-xs font-medium text-gold-600 transition-colors hover:text-gold-500"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-forest-100 bg-white/80 shadow-soft">
            {recentReservations.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-forest-400">
                No reservations yet.
              </p>
            ) : (
              <div className="divide-y divide-forest-50">
                {recentReservations.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 transition-colors hover:bg-forest-50/30"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-forest-900">
                        {r.name}
                      </p>
                      <p className="text-xs text-forest-500">
                        {formatDate(r.date)} at {r.time} · party of {r.partySize}
                      </p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.section>

        <motion.section variants={itemVariants}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-forest-900">
              Recent catering enquiries
            </h2>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-1 text-xs font-medium text-gold-600 transition-colors hover:text-gold-500"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-forest-100 bg-white/80 shadow-soft">
            {recentCatering.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-forest-400">
                No catering enquiries yet.
              </p>
            ) : (
              <div className="divide-y divide-forest-50">
                {recentCatering.map((c) => (
                  <div
                    key={c.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 transition-colors hover:bg-forest-50/30"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-forest-900">
                        {c.name}
                      </p>
                      <p className="text-xs text-forest-500">
                        {c.eventType ?? "Event"}
                        {c.eventDate ? ` · ${formatDate(c.eventDate)}` : ""}
                        {c.guestCount ? ` · ${c.guestCount} guests` : ""}
                      </p>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}

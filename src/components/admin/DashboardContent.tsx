"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  CalendarCheck2,
  Clock3,
  ChefHat,
  UtensilsCrossed,
  Tag,
  Mail,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatDate } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/Button";

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

type Stat = {
  reservations: number;
  pending: number;
  catering: number;
  items: number;
  categories: number;
  subscribers: number;
};

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

type ResvBreakdown = {
  pending: number;
  confirmed: number;
  cancelled: number;
};

interface DashboardContentProps {
  stats: Stat;
  recentReservations: Resv[];
  recentCatering: Cater[];
  featuredItems: FeaturedItem[];
  reservationBreakdown: ResvBreakdown;
}

/* ── Stat card (white / green) ───────────────────────────────── */

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: "forest" | "gold" | "spice";
  trend?: { direction: "up" | "down"; label: string };
};

function StatCard({ icon, label, value, accent = "forest", trend }: StatCardProps) {
  const accentMap = {
    forest: {
      bg: "bg-forest-50",
      icon: "text-forest-600",
      ring: "ring-forest-200",
      dot: "bg-forest-400",
    },
    gold: {
      bg: "bg-gold-300/15",
      icon: "text-gold-600",
      ring: "ring-gold-200",
      dot: "bg-gold-400",
    },
    spice: {
      bg: "bg-spice-400/8",
      icon: "text-spice-500",
      ring: "ring-spice-200",
      dot: "bg-spice-400",
    },
  };
  const a = accentMap[accent];

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -3, transition: { type: "spring" as const, stiffness: 400, damping: 22 } }}
      className={`group relative flex flex-col gap-3 rounded-2xl border border-forest-100 bg-white/80 px-5 py-5 shadow-soft backdrop-blur-sm transition-shadow duration-300 hover:shadow-md ${a.ring} hover:ring-1`}
    >
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${a.bg} ${a.icon} transition-transform duration-200 group-hover:scale-105`}>
          {icon}
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${
              trend.direction === "up"
                ? "bg-forest-100 text-forest-600"
                : "bg-spice-400/10 text-spice-500"
            }`}
          >
            {trend.direction === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.label}
          </span>
        )}
      </div>
      <div>
        <p className="font-display text-2xl font-bold text-forest-900">{value}</p>
        <p className="mt-0.5 text-sm text-forest-500">{label}</p>
      </div>
      <div className={`h-1.5 w-1.5 rounded-full ${a.dot} opacity-0 transition-opacity duration-200 group-hover:opacity-100`} />
    </motion.div>
  );
}

/* ── Status badge ─────────────────────────────────────────────── */

type StatusBadgeProps = { status: string };
function StatusBadge({ status }: StatusBadgeProps) {
  const map: Record<string, string> = {
    pending:
      "bg-gold-300/25 text-gold-700 border-gold-300/40",
    confirmed:
      "bg-forest-100 text-forest-700 border-forest-200",
    cancelled:
      "bg-spice-400/8 text-spice-600 border-spice-400/20",
    new: "bg-gold-300/25 text-gold-700 border-gold-300/40",
    contacted:
      "bg-forest-100 text-forest-700 border-forest-200",
    booked:
      "bg-forest-200 text-forest-800 border-forest-300",
    closed:
      "bg-cream-200 text-forest-400 border-forest-100",
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

/* ── Main component ───────────────────────────────────────────── */

/* ── Chart data helpers ─────────────────────────────────────── */

const DONUT_COLORS = ["#fbbf24", "#22c55e", "#f87171"]; // amber, green, red

const weeklyData = [
  { day: "Sat", orders: 120 },
  { day: "Sun", orders: 180 },
  { day: "Mon", orders: 160 },
  { day: "Tue", orders: 220 },
  { day: "Wed", orders: 190 },
  { day: "Thu", orders: 140 },
  { day: "Fri", orders: 110 },
];

/* ── Main component ───────────────────────────────────────────── */

export function DashboardContent({
  stats,
  recentReservations,
  recentCatering,
  featuredItems,
  reservationBreakdown,
}: DashboardContentProps) {
  const donutData = [
    { name: "Pending", value: reservationBreakdown.pending },
    { name: "Confirmed", value: reservationBreakdown.confirmed },
    { name: "Cancelled", value: reservationBreakdown.cancelled },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Top bar */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-forest-900">Dashboard</h1>
          <p className="mt-0.5 text-sm text-forest-500">
            Welcome back. Here&apos;s what&apos;s happening at Namche Kitchen.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-400" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-40 rounded-lg border border-forest-200 bg-white pl-8 pr-3 text-sm text-forest-800 placeholder:text-forest-400 focus:border-forest-400 focus:outline-none sm:w-56"
            />
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-forest-200 bg-white text-forest-500 transition-colors hover:text-forest-900">
            <Bell className="h-4 w-4" />
            {(stats.pending > 0 || stats.catering > 0) && (
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-cream-50" />
            )}
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-800 text-xs font-bold text-cream-50">
            A
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<CalendarCheck2 className="h-5 w-5" />}
          label="Total Reservations"
          value={stats.reservations}
          accent="forest"
          trend={{ direction: "up", label: "12%" }}
        />
        <StatCard
          icon={<Clock3 className="h-5 w-5" />}
          label="Pending"
          value={stats.pending}
          accent="gold"
          trend={{ direction: "down", label: "5%" }}
        />
        <StatCard
          icon={<ChefHat className="h-5 w-5" />}
          label="Catering Enquiries"
          value={stats.catering}
          accent="spice"
          trend={{ direction: "up", label: "8%" }}
        />
        <StatCard
          icon={<UtensilsCrossed className="h-5 w-5" />}
          label="Menu Items"
          value={stats.items}
          accent="forest"
          trend={{ direction: "up", label: "3%" }}
        />
      </section>

      {/* Charts row */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Donut chart */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-forest-100 bg-white/80 p-5 shadow-soft backdrop-blur-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-forest-900">Reservation Status</h2>
            <span className="rounded-md bg-forest-50 px-2 py-0.5 text-[11px] text-forest-500">
              Monthly
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="h-52 w-52 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      color: "#1a202c",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-3">
              {donutData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: DONUT_COLORS[i] }} />
                  <span className="text-sm text-forest-600">{d.name}</span>
                  <span className="ml-auto text-sm font-semibold text-forest-900">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured / Trending dishes */}
      <motion.section variants={itemVariants}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-forest-900">Trending Dishes</h2>
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
                className="group overflow-hidden rounded-2xl border border-forest-100 bg-white/80 shadow-soft transition-colors hover:shadow-md"
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
                  <p className="truncate text-sm font-medium text-forest-900">{item.name}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs text-forest-400">{item.category ?? "Menu"}</span>
                    <span className="text-sm font-semibold text-forest-700">
                      {item.price != null ? `$${item.price.toFixed(2)}` : item.priceLabel ?? "—"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Recent reservations + catering row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent reservations */}
        <motion.section variants={itemVariants}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-forest-900">Recent Reservations</h2>
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
              <p className="px-5 py-8 text-center text-sm text-forest-400">No reservations yet.</p>
            ) : (
              <div className="divide-y divide-forest-50">
                {recentReservations.map((r) => (
                  <div key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 transition-colors hover:bg-forest-50/30">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-forest-900">{r.name}</p>
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

        {/* Recent catering */}
        <motion.section variants={itemVariants}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-forest-900">Catering Enquiries</h2>
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
              <p className="px-5 py-8 text-center text-sm text-forest-400">No catering enquiries yet.</p>
            ) : (
              <div className="divide-y divide-forest-50">
                {recentCatering.map((c) => (
                  <div key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 transition-colors hover:bg-forest-50/30">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-forest-900">{c.name}</p>
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

      {/* Newsletter */}
      <motion.section variants={itemVariants}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-forest-900">Newsletter</h2>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-forest-100 bg-white/80 p-5 shadow-soft">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-300/15 text-gold-600">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-xl font-bold text-forest-900">{stats.subscribers}</p>
            <p className="text-xs text-forest-500">Subscribers</p>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

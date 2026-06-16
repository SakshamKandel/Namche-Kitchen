"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Users,
  Phone,
  Mail,
  FileText,
  Trash2,
  ChefHat,
  CalendarCheck2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

// ── Serialized shapes (no Date objects) ───────────────────────────────────────

export type SerializedReservation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string; // ISO
  time: string;
  partySize: number;
  notes: string | null;
  status: string;
  createdAt: string; // ISO
};

export type SerializedCatering = {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventDate: string | null; // ISO
  eventType: string | null;
  guestCount: number | null;
  message: string | null;
  status: string;
  createdAt: string; // ISO
};

// ── Status helpers ─────────────────────────────────────────────────────────────

const RESERVATION_STATUSES = ["pending", "confirmed", "cancelled"] as const;
const CATERING_STATUSES = ["new", "contacted", "booked", "closed"] as const;

type ResvStatus = (typeof RESERVATION_STATUSES)[number];
type CaterStatus = (typeof CATERING_STATUSES)[number];

function statusClasses(status: string): string {
  const map: Record<string, string> = {
    pending: "bg-gold-300/30 text-gold-700 border-gold-300/50",
    confirmed: "bg-forest-100 text-forest-700 border-forest-200",
    cancelled: "bg-spice-400/10 text-spice-600 border-spice-400/20",
    new: "bg-gold-300/30 text-gold-700 border-gold-300/50",
    contacted: "bg-forest-100 text-forest-700 border-forest-200",
    booked: "bg-forest-200 text-forest-800 border-forest-300",
    closed: "bg-cream-200 text-forest-400 border-forest-100",
  };
  return map[status] ?? "bg-cream-100 text-forest-500 border-forest-100";
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function TabButton({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-150",
        active
          ? "bg-forest-800 text-cream-50 shadow-soft"
          : "text-forest-600 hover:bg-forest-100"
      )}
    >
      {children}
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-xs font-semibold",
          active ? "bg-forest-700 text-cream-200" : "bg-forest-100 text-forest-500"
        )}
      >
        {count}
      </span>
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-50 text-forest-300">
        <CalendarDays className="h-6 w-6" />
      </div>
      <p className="text-sm text-forest-400">{message}</p>
    </div>
  );
}

// ── Reservations table ─────────────────────────────────────────────────────────

function ReservationsTable({
  items,
}: {
  items: SerializedReservation[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: ResvStatus) {
    setLoadingId(id);
    await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    startTransition(() => router.refresh());
    setLoadingId(null);
  }

  async function deleteRow(id: string, name: string) {
    if (!confirm(`Delete reservation for "${name}"? This cannot be undone.`)) return;
    setLoadingId(`del-${id}`);
    await fetch(`/api/reservations/${id}`, { method: "DELETE" });
    startTransition(() => router.refresh());
    setLoadingId(null);
  }

  if (items.length === 0) {
    return <EmptyState message="No reservations yet." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-forest-100">
            {["Guest", "Party", "Date & Time", "Contact", "Notes", "Status", ""].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-forest-400 first:pl-5 last:pr-5"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-forest-50">
          {items.map((r) => {
            const isLoading = loadingId === r.id || loadingId === `del-${r.id}` || pending;
            return (
              <tr
                key={r.id}
                className={cn(
                  "transition-colors hover:bg-forest-50/50",
                  isLoading && "opacity-50"
                )}
              >
                {/* Guest name */}
                <td className="pl-5 py-4 pr-4 font-medium text-forest-900 whitespace-nowrap">
                  {r.name}
                </td>
                {/* Party size */}
                <td className="px-4 py-4 text-forest-600 whitespace-nowrap">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-forest-400" />
                    {r.partySize}
                  </span>
                </td>
                {/* Date & time */}
                <td className="px-4 py-4 text-forest-600 whitespace-nowrap">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-forest-400" />
                    <span>
                      {formatDate(r.date)}
                      <span className="ml-1 text-forest-400">at {r.time}</span>
                    </span>
                  </span>
                </td>
                {/* Contact */}
                <td className="px-4 py-4 text-forest-600">
                  <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1.5 text-xs">
                      <Phone className="h-3 w-3 text-forest-400" />
                      {r.phone}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs">
                      <Mail className="h-3 w-3 text-forest-400" />
                      {r.email}
                    </span>
                  </div>
                </td>
                {/* Notes */}
                <td className="px-4 py-4 text-forest-500 max-w-[180px]">
                  {r.notes ? (
                    <span className="flex items-start gap-1.5 text-xs">
                      <FileText className="mt-0.5 h-3 w-3 shrink-0 text-forest-400" />
                      <span className="line-clamp-2">{r.notes}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-forest-300">—</span>
                  )}
                </td>
                {/* Status */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <select
                    value={r.status}
                    disabled={isLoading}
                    onChange={(e) => updateStatus(r.id, e.target.value as ResvStatus)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium outline-none transition-colors cursor-pointer disabled:cursor-not-allowed",
                      statusClasses(r.status)
                    )}
                  >
                    {RESERVATION_STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-white text-forest-900">
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                {/* Delete */}
                <td className="pr-5 py-4 pl-4 whitespace-nowrap">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => deleteRow(r.id, r.name)}
                    aria-label={`Delete reservation for ${r.name}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-forest-300 transition-colors hover:bg-spice-400/10 hover:text-spice-500 disabled:opacity-40"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Catering table ─────────────────────────────────────────────────────────────

function CateringTable({ items }: { items: SerializedCatering[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: CaterStatus) {
    setLoadingId(id);
    await fetch(`/api/catering/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    startTransition(() => router.refresh());
    setLoadingId(null);
  }

  async function deleteRow(id: string, name: string) {
    if (!confirm(`Delete catering inquiry from "${name}"? This cannot be undone.`)) return;
    setLoadingId(`del-${id}`);
    await fetch(`/api/catering/${id}`, { method: "DELETE" });
    startTransition(() => router.refresh());
    setLoadingId(null);
  }

  if (items.length === 0) {
    return <EmptyState message="No catering inquiries yet." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-forest-100">
            {["Contact", "Event", "Guests", "Date", "Message", "Status", ""].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-forest-400 first:pl-5 last:pr-5"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-forest-50">
          {items.map((c) => {
            const isLoading = loadingId === c.id || loadingId === `del-${c.id}` || pending;
            return (
              <tr
                key={c.id}
                className={cn(
                  "transition-colors hover:bg-forest-50/50",
                  isLoading && "opacity-50"
                )}
              >
                {/* Contact */}
                <td className="pl-5 py-4 pr-4">
                  <p className="font-medium text-forest-900 whitespace-nowrap">{c.name}</p>
                  <div className="mt-0.5 flex flex-col gap-0.5">
                    <span className="flex items-center gap-1.5 text-xs text-forest-500">
                      <Phone className="h-3 w-3 text-forest-400" />
                      {c.phone}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-forest-500">
                      <Mail className="h-3 w-3 text-forest-400" />
                      {c.email}
                    </span>
                  </div>
                </td>
                {/* Event type */}
                <td className="px-4 py-4 text-forest-600 whitespace-nowrap">
                  {c.eventType ?? <span className="text-forest-300">—</span>}
                </td>
                {/* Guest count */}
                <td className="px-4 py-4 text-forest-600 whitespace-nowrap">
                  {c.guestCount != null ? (
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-forest-400" />
                      {c.guestCount}
                    </span>
                  ) : (
                    <span className="text-forest-300">—</span>
                  )}
                </td>
                {/* Event date */}
                <td className="px-4 py-4 text-forest-600 whitespace-nowrap">
                  {c.eventDate ? (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-forest-400" />
                      {formatDate(c.eventDate)}
                    </span>
                  ) : (
                    <span className="text-forest-300">—</span>
                  )}
                </td>
                {/* Message */}
                <td className="px-4 py-4 text-forest-500 max-w-[200px]">
                  {c.message ? (
                    <span className="flex items-start gap-1.5 text-xs">
                      <FileText className="mt-0.5 h-3 w-3 shrink-0 text-forest-400" />
                      <span className="line-clamp-2">{c.message}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-forest-300">—</span>
                  )}
                </td>
                {/* Status */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <select
                    value={c.status}
                    disabled={isLoading}
                    onChange={(e) => updateStatus(c.id, e.target.value as CaterStatus)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium outline-none transition-colors cursor-pointer disabled:cursor-not-allowed",
                      statusClasses(c.status)
                    )}
                  >
                    {CATERING_STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-white text-forest-900">
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                {/* Delete */}
                <td className="pr-5 py-4 pl-4 whitespace-nowrap">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => deleteRow(c.id, c.name)}
                    aria-label={`Delete catering inquiry from ${c.name}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-forest-300 transition-colors hover:bg-spice-400/10 hover:text-spice-500 disabled:opacity-40"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function BookingsManager({
  reservations,
  catering,
}: {
  reservations: SerializedReservation[];
  catering: SerializedCatering[];
}) {
  const [tab, setTab] = useState<"reservations" | "catering">("reservations");

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 rounded-full bg-cream-100/80 p-1 w-fit">
        <TabButton
          active={tab === "reservations"}
          onClick={() => setTab("reservations")}
          count={reservations.length}
        >
          <CalendarCheck2 className="h-4 w-4" />
          Reservations
        </TabButton>
        <TabButton
          active={tab === "catering"}
          onClick={() => setTab("catering")}
          count={catering.length}
        >
          <ChefHat className="h-4 w-4" />
          Catering
        </TabButton>
      </div>

      {/* Table card */}
      <div className="rounded-2xl border border-forest-100 bg-white/70 shadow-soft overflow-hidden">
        {tab === "reservations" ? (
          <ReservationsTable items={reservations} />
        ) : (
          <CateringTable items={catering} />
        )}
      </div>

      {/* Count footer */}
      <p className="text-xs text-forest-400 pl-1">
        {tab === "reservations"
          ? `${reservations.length} reservation${reservations.length !== 1 ? "s" : ""} total`
          : `${catering.length} catering ${catering.length !== 1 ? "inquiries" : "inquiry"} total`}
      </p>
    </div>
  );
}

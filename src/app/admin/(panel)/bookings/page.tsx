import { getReservations, getCateringInquiries } from "@/lib/queries";
import { BookingsManager } from "@/components/admin/BookingsManager";

export const metadata = {
  title: "Bookings — Namche Kitchen Admin",
  description: "Manage table reservations and catering inquiries.",
};

export default async function AdminBookingsPage() {
  const [rawReservations, rawCatering] = await Promise.all([
    getReservations(),
    getCateringInquiries(),
  ]);

  // Serialize Date objects to ISO strings so the client component is safe
  const reservations = rawReservations.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    date: r.date.toISOString(),
    time: r.time,
    partySize: r.partySize,
    notes: r.notes ?? null,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  }));

  const catering = rawCatering.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    eventDate: c.eventDate ? c.eventDate.toISOString() : null,
    eventType: c.eventType ?? null,
    guestCount: c.guestCount ?? null,
    message: c.message ?? null,
    status: c.status,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-forest-900">
          Bookings
        </h1>
        <p className="mt-1 text-sm text-forest-500">
          Review and manage table reservations and catering inquiries.
        </p>
      </div>
      <BookingsManager reservations={reservations} catering={catering} />
    </div>
  );
}

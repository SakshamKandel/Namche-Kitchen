import {
  getReservations,
  getCateringInquiries,
  getFeaturedItems,
} from "@/lib/queries";
import { getDashboardData } from "@/lib/dashboard-data";
import { DashboardContent } from "@/components/admin/DashboardContent";

export const metadata = {
  title: "Dashboard — Namche Kitchen Admin",
  description: "Overview of reservations, catering and menu stats.",
};

export default async function AdminDashboardPage() {
  const [dashboard, reservations, catering, featuredRaw] = await Promise.all([
    getDashboardData(),
    getReservations(),
    getCateringInquiries(),
    getFeaturedItems(6),
  ]);

  const recentReservations = reservations.slice(0, 5).map((r) => ({
    id: r.id,
    name: r.name,
    date: r.date,
    time: r.time,
    partySize: r.partySize,
    status: r.status,
  }));

  const recentCatering = catering.slice(0, 5).map((c) => ({
    id: c.id,
    name: c.name,
    eventType: c.eventType,
    eventDate: c.eventDate,
    guestCount: c.guestCount,
    status: c.status,
  }));

  const featuredItems = featuredRaw.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    priceLabel: item.priceLabel,
    imageUrl: item.imageUrl,
    category: item.category?.name ?? null,
  }));

  return (
    <DashboardContent
      data={dashboard}
      recentReservations={recentReservations}
      recentCatering={recentCatering}
      featuredItems={featuredItems}
    />
  );
}

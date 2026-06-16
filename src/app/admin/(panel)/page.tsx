import {
  getAdminStats,
  getReservations,
  getCateringInquiries,
  getFeaturedItems,
} from "@/lib/queries";
import { DashboardContent } from "@/components/admin/DashboardContent";

export const metadata = {
  title: "Dashboard — Namche Kitchen Admin",
  description: "Overview of reservations, catering and menu stats.",
};

export default async function AdminDashboardPage() {
  const [stats, reservations, catering, featuredRaw] = await Promise.all([
    getAdminStats(),
    getReservations(),
    getCateringInquiries(),
    getFeaturedItems(6),
  ]);

  const recentReservations = reservations.slice(0, 5);
  const recentCatering = catering.slice(0, 5);

  const reservationBreakdown = {
    pending: reservations.filter((r) => r.status === "pending").length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,
  };

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
      stats={stats}
      recentReservations={recentReservations}
      recentCatering={recentCatering}
      featuredItems={featuredItems}
      reservationBreakdown={reservationBreakdown}
    />
  );
}

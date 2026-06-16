import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { MobileCtaBar } from "@/components/site/MobileCtaBar";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { getCategoriesWithItems } from "@/lib/queries";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rawCategories = await getCategoriesWithItems({ onlyAvailable: true });

  // Serialize for the client header — keep only what the dropdown needs.
  const menuCategories = rawCategories
    .slice(0, 6)
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      items: cat.items.slice(0, 3).map((item) => ({
        id: item.id,
        name: item.name,
        imageUrl: item.imageUrl ?? null,
        price: item.price ?? null,
        priceLabel: item.priceLabel ?? null,
      })),
    }));

  return (
    <>
      <AnnouncementBar />
      <SiteHeader menuCategories={menuCategories} />
      <main className="min-h-screen pb-24 md:pb-0">{children}</main>
      <SiteFooter />
      <MobileCtaBar />
      <ChatWidget />
    </>
  );
}

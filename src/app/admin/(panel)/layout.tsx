import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return <AdminShell admin={admin}>{children}</AdminShell>;
}

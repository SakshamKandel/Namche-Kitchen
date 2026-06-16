import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = {
  title: "Admin Login — Namche Kitchen",
  description: "Sign in to the Namche Kitchen admin panel.",
};

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      {/* Animated background blobs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/3 h-[600px] w-[600px] animate-[pulse_8s_ease-in-out_infinite] rounded-full bg-forest-100/40 blur-[100px]" />
        <div className="absolute -bottom-40 right-1/4 h-[500px] w-[500px] animate-[pulse_10s_ease-in-out_infinite_2s] rounded-full bg-gold-200/30 blur-[100px]" />
        <div className="absolute top-1/2 left-1/4 h-[300px] w-[300px] animate-[pulse_7s_ease-in-out_infinite_1s] rounded-full bg-forest-200/20 blur-[80px]" />
      </div>

      {/* Subtle grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-900 shadow-lg shadow-forest-900/20">
            <span className="font-display text-2xl font-bold text-cream-50">N</span>
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-forest-900">
              Namche Kitchen
            </p>
            <p className="text-sm tracking-wider text-forest-500 uppercase">
              Admin Portal
            </p>
          </div>
        </div>

        {/* Login card */}
        <div className="rounded-3xl border border-forest-100/80 bg-white/80 px-8 py-10 shadow-subtle backdrop-blur-xl transition-shadow duration-300 hover:shadow-lg">
          <h1 className="mb-1 font-display text-2xl font-semibold text-forest-900">
            Welcome back
          </h1>
          <p className="mb-8 text-sm text-forest-500">
            Sign in to manage reservations, menu &amp; more.
          </p>
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-forest-400/60">
          &copy; {new Date().getFullYear()} Namche Kitchen. All rights reserved.
        </p>
      </div>
    </main>
  );
}

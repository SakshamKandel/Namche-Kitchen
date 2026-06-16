"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, LogIn, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          if (res.status === 401) {
            setError("Incorrect email or password. Please try again.");
          } else {
            const data = await res.json().catch(() => ({}));
            setError(
              (data as { error?: string }).error ??
                "Something went wrong. Please try again."
            );
          }
          return;
        }

        const from = searchParams.get("from");
        router.push(from && from.startsWith("/admin") ? from : "/admin");
        router.refresh();
      } catch {
        setError("Network error. Please check your connection and try again.");
      }
    });
  }

  const inputBase =
    "w-full rounded-xl border bg-cream-50/60 px-4 py-3 text-sm text-forest-900 placeholder:text-forest-400/50 outline-none transition-all duration-300 focus:ring-[3px] focus:ring-forest-400/20 focus:border-forest-400 disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Email */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring" as const, stiffness: 300, damping: 24 }}
        className="flex flex-col gap-1.5"
      >
        <label
          htmlFor="admin-email"
          className="text-xs font-semibold uppercase tracking-wide text-forest-600"
        >
          Email address
        </label>
        <div className="relative">
          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            disabled={isPending}
            className={cn(
              inputBase,
              error ? "border-spice-400" : "border-forest-200",
              focusedField === "email" && "bg-white shadow-sm"
            )}
          />
          {focusedField === "email" && (
            <motion.span
              layoutId="focus-ring"
              className="pointer-events-none absolute inset-0 rounded-xl ring-[3px] ring-forest-400/10"
              transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
            />
          )}
        </div>
      </motion.div>

      {/* Password */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, type: "spring" as const, stiffness: 300, damping: 24 }}
        className="flex flex-col gap-1.5"
      >
        <label
          htmlFor="admin-password"
          className="text-xs font-semibold uppercase tracking-wide text-forest-600"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            disabled={isPending}
            className={cn(
              inputBase,
              "pr-11",
              error ? "border-spice-400" : "border-forest-200",
              focusedField === "password" && "bg-white shadow-sm"
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-forest-400 transition-colors hover:bg-forest-100 hover:text-forest-700"
          >
            <AnimatePresence mode="wait" initial={false}>
              {showPassword ? (
                <motion.span
                  key="eyeoff"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <EyeOff className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="eye"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Eye className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ type: "spring" as const, stiffness: 300, damping: 24 }}
            className="flex items-start gap-2.5 rounded-xl border border-spice-400/25 bg-spice-400/8 px-4 py-3 text-sm text-spice-600"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring" as const, stiffness: 300, damping: 24 }}
      >
        <Button
          type="submit"
          variant="forest"
          size="md"
          disabled={isPending || !email || !password}
          className="group mt-1 w-full"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream-50/40 border-t-cream-50" />
              Signing in…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              Sign in
            </span>
          )}
        </Button>
      </motion.div>

      {/* Security note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-1.5 text-center text-[11px] text-forest-400/60"
      >
        <ShieldCheck className="h-3 w-3" />
        Secure admin access only
      </motion.p>
    </form>
  );
}

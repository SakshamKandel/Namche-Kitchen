"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Status =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

const inputCls =
  "w-full rounded-xl border border-forest-200 bg-white px-4 py-3 text-sm text-forest-900 placeholder:text-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-400 focus:border-transparent transition";

/**
 * Compact email capture posting to /api/newsletter. The "footer" variant is a
 * tight inline row; "block" is a fuller stacked card with a heading.
 */
export function NewsletterSignup({
  source = "footer",
  className,
  variant = "footer",
}: {
  source?: string;
  className?: string;
  variant?: "footer" | "block";
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<Status>({ status: "idle" });

  const busy = state.status === "submitting";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setState({ status: "submitting" });

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: source ?? "footer" }),
      });

      if (res.status === 201 || res.ok) {
        setState({ status: "success" });
        setEmail("");
        return;
      }

      const body = await res.json().catch(() => ({}));
      setState({
        status: "error",
        message:
          body?.error ?? "Something went wrong. Please try again in a moment.",
      });
    } catch {
      setState({
        status: "error",
        message: "Network error — please check your connection and try again.",
      });
    }
  }

  if (state.status === "success") {
    return (
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-xl text-sm font-medium text-forest-700",
          variant === "block" &&
            "border border-cream-200 bg-forest-50 px-4 py-3.5",
          className
        )}
      >
        <CheckCircle2 className="h-5 w-5 shrink-0 text-forest-600" strokeWidth={1.75} />
        You are on the list — talk soon!
      </div>
    );
  }

  const form = (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn(
        "flex gap-2",
        variant === "block" ? "flex-col sm:flex-row" : "flex-col sm:flex-row"
      )}
    >
      <label htmlFor={`newsletter-${source}`} className="sr-only">
        Email address
      </label>
      <input
        id={`newsletter-${source}`}
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={busy}
        className={cn(inputCls, "flex-1")}
      />
      <Button
        type="submit"
        variant="forest"
        size="md"
        disabled={busy}
        className="shrink-0 sm:w-auto"
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Joining…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Subscribe
          </>
        )}
      </Button>
    </form>
  );

  if (variant === "block") {
    return (
      <div
        className={cn(
          "rounded-2xl border border-cream-200 bg-white/70 p-6 shadow-subtle sm:p-8",
          className
        )}
      >
        <h3 className="font-display text-xl font-semibold text-forest-900">
          Join our table
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-forest-600">
          Seasonal specials, new dishes and the occasional momo secret —
          straight to your inbox.
        </p>
        <div className="mt-5">{form}</div>
        {state.status === "error" && (
          <p className="mt-3 text-sm text-spice-600">{state.message}</p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {form}
      {state.status === "error" && (
        <p className="mt-2 text-xs text-spice-600">{state.message}</p>
      )}
    </div>
  );
}

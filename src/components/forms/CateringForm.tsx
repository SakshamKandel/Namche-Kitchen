"use client";

import { useState, FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const fieldCls =
  "w-full rounded-xl border border-forest-200 bg-white px-4 py-3 text-sm text-forest-900 placeholder:text-forest-400 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-forest-400";

const labelCls =
  "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-forest-700";

const EVENT_TYPES = [
  "Birthday",
  "Corporate",
  "Wedding",
  "Festival",
  "Other",
] as const;

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; name: string }
  | { status: "error"; message: string };

function SuccessPanel({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center gap-5 py-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-100">
        <CheckCircle2 className="h-8 w-8 text-forest-700" strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="font-display text-2xl font-semibold text-forest-900">
          Thank you, {name}!
        </h3>
        <p className="mt-2 max-w-sm text-sm text-forest-700/70">
          Your catering enquiry has been received. Our team will be in touch
          within one business day to discuss the details.
        </p>
      </div>
      <p className="text-xs text-forest-400">
        We look forward to making your event special.
      </p>
    </div>
  );
}

export function CateringForm() {
  const [state, setState] = useState<FormState>({ status: "idle" });

  const [fields, setFields] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    eventType: EVENT_TYPES[0] as string,
    guestCount: "",
    message: "",
  });

  const set =
    (key: keyof typeof fields) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setState({ status: "submitting" });

    try {
      const payload: Record<string, unknown> = {
        name: fields.name,
        email: fields.email,
        phone: fields.phone,
        eventType: fields.eventType,
        message: fields.message || undefined,
      };
      if (fields.eventDate) payload.eventDate = fields.eventDate;
      if (fields.guestCount) payload.guestCount = Number(fields.guestCount);

      const res = await fetch("/api/catering", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        setState({ status: "success", name: fields.name });
        return;
      }

      const body = await res.json().catch(() => ({}));
      setState({
        status: "error",
        message:
          body?.error ??
          "Something went wrong. Please try again or contact us directly.",
      });
    } catch {
      setState({
        status: "error",
        message: "Network error — please check your connection and try again.",
      });
    }
  }

  const busy = state.status === "submitting";

  if (state.status === "success") {
    return <SuccessPanel name={state.name} />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* Event type — selectable chips */}
      <div>
        <label className={labelCls}>
          Event type <span className="text-forest-400">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {EVENT_TYPES.map((type) => {
            const active = fields.eventType === type;
            return (
              <button
                key={type}
                type="button"
                aria-pressed={active}
                disabled={busy}
                onClick={() =>
                  setFields((f) => ({ ...f, eventType: type }))
                }
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
                  active
                    ? "border-forest-800 bg-forest-800 text-cream-50 shadow-subtle"
                    : "border-forest-200 bg-white text-forest-700 hover:border-forest-300 hover:bg-forest-50"
                )}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="cat-name" className={labelCls}>
          Full name <span className="text-forest-400">*</span>
        </label>
        <input
          id="cat-name"
          type="text"
          required
          autoComplete="name"
          placeholder="Your name"
          value={fields.name}
          onChange={set("name")}
          disabled={busy}
          className={fieldCls}
        />
      </div>

      {/* Email + Phone */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cat-email" className={labelCls}>
            Email <span className="text-forest-400">*</span>
          </label>
          <input
            id="cat-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={fields.email}
            onChange={set("email")}
            disabled={busy}
            className={fieldCls}
          />
        </div>
        <div>
          <label htmlFor="cat-phone" className={labelCls}>
            Phone <span className="text-forest-400">*</span>
          </label>
          <input
            id="cat-phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="(403) 000-0000"
            value={fields.phone}
            onChange={set("phone")}
            disabled={busy}
            className={fieldCls}
          />
        </div>
      </div>

      {/* Event date + Guest count */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cat-date" className={labelCls}>
            Event date{" "}
            <span className="font-normal normal-case tracking-normal text-forest-400">
              (optional)
            </span>
          </label>
          <input
            id="cat-date"
            type="date"
            value={fields.eventDate}
            onChange={set("eventDate")}
            disabled={busy}
            className={fieldCls}
          />
        </div>
        <div>
          <label htmlFor="cat-guests" className={labelCls}>
            Estimated guest count
          </label>
          <input
            id="cat-guests"
            type="number"
            min={1}
            placeholder="e.g. 40"
            value={fields.guestCount}
            onChange={set("guestCount")}
            disabled={busy}
            className={fieldCls}
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="cat-message" className={labelCls}>
          Tell us about your event
        </label>
        <textarea
          id="cat-message"
          rows={4}
          placeholder="Menu preferences, venue details, dietary requirements, budget range…"
          value={fields.message}
          onChange={set("message")}
          disabled={busy}
          className={cn(fieldCls, "resize-none")}
        />
      </div>

      {/* Error */}
      {state.status === "error" && (
        <p className="rounded-xl border border-spice-400/30 bg-spice-400/10 px-4 py-3 text-sm text-spice-600">
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        variant="forest"
        size="lg"
        disabled={busy}
        className="mt-1 w-full"
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending enquiry…
          </>
        ) : (
          "Send Catering Enquiry"
        )}
      </Button>

      <p className="text-center text-xs text-forest-500">
        We respond to all enquiries within one business day.
      </p>
    </form>
  );
}

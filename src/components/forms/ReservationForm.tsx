"use client";

import { useState, FormEvent } from "react";
import { CalendarDays, Clock, Users, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Time slots 11:30 AM – 9:00 PM in 30-min steps                       */
/* ------------------------------------------------------------------ */
function buildTimeSlots(): { value: string; label: string }[] {
  const slots: { value: string; label: string }[] = [];
  // 11:30 = 690 min; 21:00 = 1260 min (last seating)
  for (let minutes = 690; minutes <= 1260; minutes += 30) {
    const h24 = Math.floor(minutes / 60);
    const m = minutes % 60;
    const value = `${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    const ampm = h24 >= 12 ? "PM" : "AM";
    const h12 = h24 > 12 ? h24 - 12 : h24 === 0 ? 12 : h24;
    const label = `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
    slots.push({ value, label });
  }
  return slots;
}

const TIME_SLOTS = buildTimeSlots();

/* ------------------------------------------------------------------ */
/* Today's date string (yyyy-mm-dd) for the min attribute              */
/* ------------------------------------------------------------------ */
function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* ------------------------------------------------------------------ */
/* Shared input / select styling                                        */
/* ------------------------------------------------------------------ */
const fieldCls =
  "w-full rounded-xl border border-forest-200 bg-white px-4 py-3 text-forest-900 placeholder:text-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-400 focus:border-transparent transition text-sm";

const labelCls = "block mb-1.5 text-xs font-semibold uppercase tracking-widest text-forest-700";

/* ------------------------------------------------------------------ */
/* Party-size + occasion choices                                       */
/* ------------------------------------------------------------------ */
const PARTY_PILLS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const PARTY_LARGE = [9, 10, 11, 12] as const;

const OCCASIONS = [
  "",
  "Birthday",
  "Anniversary",
  "Date night",
  "Business",
  "Celebration",
] as const;

const occasionLabel = (o: string) => (o === "" ? "None" : o);

/* A pill/chip toggle button shared by party size + occasion. */
function ChoiceButton({
  active,
  disabled,
  onClick,
  children,
  className,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-xl border px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-400 disabled:opacity-50",
        active
          ? "border-forest-800 bg-forest-800 text-cream-50 shadow-subtle"
          : "border-forest-200 bg-white text-forest-700 hover:border-forest-400 hover:bg-forest-50",
        className
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Success panel                                                        */
/* ------------------------------------------------------------------ */
function SuccessPanel({
  name,
  date,
  time,
  partySize,
}: {
  name: string;
  date: string;
  time: string;
  partySize: string;
}) {
  const dateLabel = new Date(`${date}T12:00:00`).toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeSlot = TIME_SLOTS.find((s) => s.value === time);
  return (
    <div className="flex flex-col items-center gap-5 py-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-100">
        <CheckCircle2 className="h-8 w-8 text-forest-700" strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="font-display text-2xl font-semibold text-forest-900">
          We&rsquo;ll see you soon, {name}!
        </h3>
        <p className="mt-1 text-sm text-forest-700/70">
          Your reservation request has been received.
        </p>
      </div>
      <div className="grid w-full max-w-xs gap-2 rounded-xl border border-cream-200 bg-forest-50 p-5 text-left text-sm">
        <Row icon={<CalendarDays className="h-4 w-4" />} label="Date" value={dateLabel} />
        <Row icon={<Clock className="h-4 w-4" />} label="Time" value={timeSlot?.label ?? time} />
        <Row icon={<Users className="h-4 w-4" />} label="Party" value={`${partySize} guest${Number(partySize) !== 1 ? "s" : ""}`} />
      </div>
      <p className="max-w-xs text-xs text-forest-500">
        We&rsquo;ll confirm by phone or email. For same-day bookings please call us directly.
      </p>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-gold-500">{icon}</span>
      <span className="w-12 shrink-0 font-medium text-forest-500">{label}</span>
      <span className="font-semibold text-forest-800">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main form                                                            */
/* ------------------------------------------------------------------ */
type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; name: string; date: string; time: string; partySize: string }
  | { status: "error"; message: string };

export function ReservationForm() {
  const [state, setState] = useState<FormState>({ status: "idle" });

  const [fields, setFields] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: TIME_SLOTS[0]?.value ?? "11:30",
    partySize: "2",
    occasion: "",
    notes: "",
  });

  const set = (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

  // Direct setter for the pill / chip controls.
  const setField = (key: keyof typeof fields, value: string) =>
    setFields((f) => ({ ...f, [key]: value }));

  // True when the current party size came from the 9–12 select.
  const largeSelected = (PARTY_LARGE as readonly number[])
    .map(String)
    .includes(fields.partySize);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setState({ status: "submitting" });

    // Fold the chosen occasion into the notes string so the API contract
    // (which has no dedicated `occasion` field) stays unchanged.
    const trimmedNotes = fields.notes.trim();
    const combinedNotes = fields.occasion
      ? `Occasion: ${fields.occasion}${trimmedNotes ? `\n${trimmedNotes}` : ""}`
      : trimmedNotes;

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name,
          email: fields.email,
          phone: fields.phone,
          date: fields.date,
          time: fields.time,
          partySize: Number(fields.partySize.replace("+", "")),
          notes: combinedNotes || undefined,
        }),
      });

      if (res.status === 201) {
        setState({
          status: "success",
          name: fields.name,
          date: fields.date,
          time: fields.time,
          partySize: fields.partySize,
        });
        return;
      }

      const body = await res.json().catch(() => ({}));
      setState({
        status: "error",
        message:
          body?.error ??
          "Something went wrong. Please try again or call us directly.",
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
    return (
      <SuccessPanel
        name={state.name}
        date={state.date}
        time={state.time}
        partySize={state.partySize}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Name */}
      <div>
        <label htmlFor="res-name" className={labelCls}>
          Full name <span className="text-forest-400">*</span>
        </label>
        <input
          id="res-name"
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
          <label htmlFor="res-email" className={labelCls}>
            Email <span className="text-forest-400">*</span>
          </label>
          <input
            id="res-email"
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
          <label htmlFor="res-phone" className={labelCls}>
            Phone <span className="text-forest-400">*</span>
          </label>
          <input
            id="res-phone"
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

      {/* Date + Time */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="res-date" className={labelCls}>
            Date <span className="text-forest-400">*</span>
          </label>
          <input
            id="res-date"
            type="date"
            required
            min={todayIso()}
            value={fields.date}
            onChange={set("date")}
            disabled={busy}
            className={fieldCls}
          />
        </div>
        <div>
          <label htmlFor="res-time" className={labelCls}>
            Time <span className="text-forest-400">*</span>
          </label>
          <select
            id="res-time"
            required
            value={fields.time}
            onChange={set("time")}
            disabled={busy}
            className={cn(fieldCls, "appearance-none")}
          >
            {TIME_SLOTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Party size */}
      <fieldset>
        <legend className={cn(labelCls, "mb-2")}>
          Party size <span className="text-forest-400">*</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {PARTY_PILLS.map((n) => (
            <ChoiceButton
              key={n}
              active={fields.partySize === String(n)}
              disabled={busy}
              onClick={() => setField("partySize", String(n))}
              className="min-w-11"
            >
              {n}
            </ChoiceButton>
          ))}

          {/* 9–12 compact select */}
          <select
            aria-label="Party of 9 to 12 guests"
            value={largeSelected ? fields.partySize : ""}
            onChange={(e) => {
              if (e.target.value) setField("partySize", e.target.value);
            }}
            disabled={busy}
            className={cn(
              "rounded-xl border px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-400 disabled:opacity-50",
              largeSelected
                ? "border-forest-800 bg-forest-800 text-cream-50"
                : "border-forest-200 bg-white text-forest-700 hover:border-forest-400"
            )}
          >
            <option value="" disabled>
              9–12
            </option>
            {PARTY_LARGE.map((n) => (
              <option key={n} value={String(n)}>
                {n}
              </option>
            ))}
          </select>

          {/* 12+ pill */}
          <ChoiceButton
            active={fields.partySize === "12+"}
            disabled={busy}
            onClick={() => setField("partySize", "12+")}
          >
            12+
          </ChoiceButton>
        </div>
        <p className="mt-2 text-xs text-forest-500">
          {fields.partySize === "12+"
            ? "Parties over 12 — we'll be in touch to plan the details."
            : `Table for ${fields.partySize} ${Number(fields.partySize) === 1 ? "guest" : "guests"}.`}
        </p>
      </fieldset>

      {/* Occasion (optional) — folded into notes on submit */}
      <fieldset>
        <legend className={cn(labelCls, "mb-2")}>Occasion</legend>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((o) => (
            <ChoiceButton
              key={o || "none"}
              active={fields.occasion === o}
              disabled={busy}
              onClick={() => setField("occasion", o)}
            >
              {occasionLabel(o)}
            </ChoiceButton>
          ))}
        </div>
      </fieldset>

      {/* Notes */}
      <div>
        <label htmlFor="res-notes" className={labelCls}>
          Special requests
        </label>
        <textarea
          id="res-notes"
          rows={3}
          placeholder="Dietary needs, occasion, seating preference…"
          value={fields.notes}
          onChange={set("notes")}
          disabled={busy}
          className={cn(fieldCls, "resize-none")}
        />
      </div>

      {/* Error */}
      {state.status === "error" && (
        <p className="rounded-xl border border-forest-300/30 bg-forest-50 px-4 py-3 text-sm text-forest-600">
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
            Sending request…
          </>
        ) : (
          "Request Reservation"
        )}
      </Button>

      <p className="text-center text-xs text-forest-500">
        By submitting you agree to be contacted about your booking.
      </p>
    </form>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  RotateCcw,
  ShoppingBag,
  CalendarDays,
  Phone,
} from "lucide-react";
import { MountainMark } from "@/components/brand/MountainMark";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "namche-chat-v1";

const GREETING =
  "Namaste, and welcome to Namche Kitchen. I can help with our menu, dietary options, hours, ordering, reservations and catering. What can I get you?";

const SUGGESTIONS = [
  "What are your hours?",
  "Which dishes are vegan?",
  "What's your most popular dish?",
];

/** Turn URLs, internal routes and phone numbers in a reply into clickable links. */
function renderRich(text: string): ReactNode[] {
  const re =
    /(https?:\/\/[^\s<>()]+)|(\/(?:menu|reservations|catering|about)\b)|(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/g;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  const linkCls =
    "font-medium underline underline-offset-2 transition-opacity hover:opacity-70";

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const token = m[0];
    if (m[1]) {
      out.push(
        <a key={key++} href={token} target="_blank" rel="noopener noreferrer" className={linkCls}>
          {token}
        </a>
      );
    } else if (m[2]) {
      out.push(
        <a key={key++} href={token} className={linkCls}>
          {token}
        </a>
      );
    } else {
      out.push(
        <a key={key++} href={`tel:${token.replace(/[^\d+]/g, "")}`} className={linkCls}>
          {token}
        </a>
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-forest-400 animate-doodle-float"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.9s" }}
        />
      ))}
    </span>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const reduce = useReducedMotion();

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Restore a prior conversation.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved) && saved.length > 0) setMessages(saved);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Persist it.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      /* ignore (private mode / quota) */
    }
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [messages, loading, reduce]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 180);
      return () => clearTimeout(t);
    }
  }, [open]);

  function resetChat() {
    setMessages([{ role: "assistant", content: GREETING }]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Drop the canned greeting; send recent conversational turns only.
        body: JSON.stringify({ messages: next.slice(1).slice(-12) }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              data?.error ?? `Sorry, something went wrong. Please call us at ${SITE.phone}.`,
          },
        ]);
        return;
      }

      // Stream the reply in token-by-token.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      let created = false;

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        if (!created) {
          if (!acc.trim()) continue;
          created = true;
          setMessages((m) => [...m, { role: "assistant", content: acc }]);
        } else {
          setMessages((m) => {
            const copy = [...m];
            copy[copy.length - 1] = { role: "assistant", content: acc };
            return copy;
          });
        }
      }

      if (!created) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "I didn't catch that — could you rephrase?" },
        ]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `I couldn't reach the kitchen just now — please try again, or call ${SITE.phone}.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const awaitingFirstToken = loading && messages[messages.length - 1]?.role === "user";
  const showWelcome = messages.length === 1 && !loading;

  const quickActions = [
    { label: "Order online", href: SITE.orderUrl, external: true, icon: ShoppingBag },
    { label: "Book a table", href: "/reservations", external: false, icon: CalendarDays },
    { label: "Call us", href: SITE.phoneHref, external: false, icon: Phone },
  ];

  return (
    <div className="pointer-events-none fixed bottom-20 right-4 z-50 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Namche Kitchen chat assistant"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            style={{ transformOrigin: "bottom right" }}
            className="pointer-events-auto flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-cream-200 bg-cream-50 shadow-[0_20px_60px_-15px_rgba(15,30,23,0.35)]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-forest-800 px-4 py-3.5 text-cream-50">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-700">
                <MountainMark tone="cream" className="h-5 w-5" />
              </span>
              <div className="flex-1 leading-tight">
                <p className="font-display text-sm font-semibold">Namche Assistant</p>
                <p className="flex items-center gap-1.5 text-[0.7rem] text-cream-200/70">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-forest-300" />
                  Usually replies instantly
                </p>
              </div>
              <button
                type="button"
                onClick={resetChat}
                aria-label="Start a new chat"
                title="New chat"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-cream-200 transition-colors hover:bg-forest-700 hover:text-cream-50"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-cream-200 transition-colors hover:bg-forest-700 hover:text-cream-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              aria-live="polite"
              className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    m.role === "user"
                      ? "self-end rounded-tr-sm bg-forest-800 text-cream-50"
                      : "self-start rounded-tl-sm border border-cream-200 bg-white text-forest-800"
                  )}
                >
                  {renderRich(m.content)}
                </div>
              ))}

              {awaitingFirstToken && (
                <div className="self-start rounded-2xl rounded-tl-sm border border-cream-200 bg-white px-4 py-3">
                  <TypingDots />
                </div>
              )}

              {showWelcome && (
                <div className="mt-1 flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((a) => (
                      <a
                        key={a.label}
                        href={a.href}
                        {...(a.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="inline-flex items-center gap-1.5 rounded-full bg-forest-800 px-3 py-1.5 text-xs font-medium text-cream-50 transition-colors hover:bg-forest-700"
                      >
                        <a.icon className="h-3.5 w-3.5" />
                        {a.label}
                      </a>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="rounded-full border border-cream-300 bg-white px-3 py-1.5 text-xs font-medium text-forest-700 transition-colors hover:border-forest-300 hover:bg-forest-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-cream-200 bg-cream-50 px-3 py-3"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the menu, hours, ordering…"
                aria-label="Type your message"
                maxLength={500}
                disabled={loading}
                className="min-w-0 flex-1 rounded-full border border-cream-300 bg-white px-4 py-2.5 text-sm text-forest-900 placeholder:text-forest-400 focus:border-forest-300 focus:outline-none focus:ring-2 focus:ring-forest-300/40 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-400 text-forest-900 transition-colors hover:bg-gold-300 disabled:opacity-40"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>

            <p className="bg-cream-50 px-4 pb-3 text-center text-[0.65rem] text-forest-400">
              AI assistant · confirm details by calling {SITE.phone}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating toggle button */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.92 }}
        aria-label={open ? "Close chat" : "Chat with us"}
        aria-expanded={open}
        className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-forest-800 text-cream-50 shadow-lg ring-1 ring-forest-900/10 transition-colors hover:bg-forest-700"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

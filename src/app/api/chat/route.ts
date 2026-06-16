import { NextResponse } from "next/server";
import { z } from "zod";
import { SITE } from "@/lib/constants";
import { getCategoriesWithItems } from "@/lib/queries";
import { displayPrice } from "@/lib/utils";

// Needs the Node runtime (Prisma) — not the Edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(24),
});

/** Build the grounding system prompt from site config + the live menu. */
async function buildSystemPrompt(): Promise<string> {
  let menu = "(menu temporarily unavailable)";
  try {
    const cats = await getCategoriesWithItems({ onlyAvailable: true });
    menu = cats
      .map((c) => {
        const items = c.items
          .map((i) => {
            const price = displayPrice(i);
            const tags = i.tags ? ` [${i.tags}]` : "";
            return `${i.name}${price ? ` – ${price}` : ""}${tags}`;
          })
          .join("; ");
        return `• ${c.name}: ${items}`;
      })
      .join("\n");
  } catch {
    /* keep fallback text */
  }

  const hours = SITE.hours.map((h) => `${h.days} ${h.time}`).join("; ");

  return [
    `You are the virtual host for ${SITE.name} — ${SITE.description}`,
    `Help guests with the menu, dietary needs, hours, location, ordering, reservations and catering. Be warm, professional and genuinely helpful.`,
    ``,
    `STYLE`,
    `- Keep replies short and skimmable: 1–3 sentences, or a few short "- " bullet points for lists.`,
    `- Plain text only. No markdown headings, no bold/asterisks, and NO emojis.`,
    `- When recommending an action, include the relevant link on its own as plain text so it stays clickable: ${SITE.orderUrl} for online orders, /reservations to book a table, /catering for events, and the phone ${SITE.phone}.`,
    ``,
    `KEY FACTS`,
    `- Cuisine: Himalayan (Nepali) and Halal Middle-Eastern comfort food. All meat is halal; many vegetarian and vegan dishes (shown with tags).`,
    `- Location: ${SITE.address.line1}, ${SITE.address.line2}.`,
    `- Phone: ${SITE.phone}. Email: ${SITE.email}.`,
    `- Hours: ${hours}.`,
    `- Order online (pickup/delivery): ${SITE.orderUrl}`,
    ``,
    `MENU (prices in CAD)`,
    menu,
    ``,
    `RULES`,
    `- Only answer questions about ${SITE.name}. Politely decline anything unrelated.`,
    `- To place an order, send guests to ${SITE.orderUrl}. For bookings use /reservations; for events or large groups use /catering.`,
    `- Never invent menu items, prices, or facts that aren't listed above. If unsure (e.g. specific allergens or today's specials), say so and suggest calling ${SITE.phone}.`,
  ].join("\n");
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: `The assistant isn't set up yet. Please call us at ${SITE.phone}.` },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Sorry, I couldn't read that message." }, { status: 400 });
  }

  const recent = parsed.data.messages.slice(-12);
  const system = await buildSystemPrompt();
  const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

  let upstream: Response;
  try {
    upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://namchekitchen.ca",
        "X-Title": SITE.name,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: system }, ...recent],
        max_tokens: 500,
        temperature: 0.4,
        stream: true,
      }),
    });
  } catch (err) {
    console.error("Chat route error", err);
    return NextResponse.json(
      { error: "I couldn't reach the kitchen just now. Please try again in a moment." },
      { status: 502 }
    );
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error("OpenRouter error", upstream.status, detail.slice(0, 500));
    return NextResponse.json(
      { error: "The assistant is unavailable right now — please try again or call us." },
      { status: 502 }
    );
  }

  // Parse OpenRouter's SSE stream server-side and re-emit just the text deltas
  // as a plain-text stream — keeps the client simple and robust.
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let nl: number;
          while ((nl = buffer.indexOf("\n")) >= 0) {
            const line = buffer.slice(0, nl).trim();
            buffer = buffer.slice(nl + 1);
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const delta: string | undefined = json?.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              /* ignore keep-alives / partial frames */
            }
          }
        }
        controller.close();
      } catch (err) {
        console.error("Chat stream error", err);
        controller.error(err);
      } finally {
        reader.releaseLock();
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}

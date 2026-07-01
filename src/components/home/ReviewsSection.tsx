import { Quote, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

type Review = {
  name: string;
  meta: string;
  photo: string;
  quote: string;
};

const REVIEWS: Review[] = [
  {
    name: "Anand Kane",
    meta: "Ottawa, ON",
    photo: "/testimonails/Anand Kane.png",
    quote:
      "The momo here taste exactly like home — hand-folded, juicy, and the achar has a real kick. I drove across the city for them and I'd do it again. Best Nepali food in Ottawa, full stop.",
  },
  {
    name: "Prasansha Paudel",
    meta: "Regular",
    photo: "/testimonails/Prasansha Paudel.png",
    quote:
      "We order the family platter almost every weekend now. Everything's halal so the whole family can share, the portions are huge, and the chowmein never disappoints. Warm staff, warmer food.",
  },
  {
    name: "Bikash Gurung",
    meta: "DoorDash regular",
    photo: "/testimonails/Bikash Gurung.png",
    quote:
      "Ordered the shawarma platter and butter chicken for a work lunch — arrived hot, spiced perfectly, and not greasy at all. You can tell it's made fresh. The masala tea is the move on a cold Ottawa day.",
  },
  {
    name: "Bhim Kunwar",
    meta: "Wellington West",
    photo: "/testimonails/Bhim Kunwar.png",
    quote:
      "Hidden gem on Wellington. The chilli momo and Hakka noodles are unreal, prices are fair, and the owners actually remember your name. This is what a neighbourhood restaurant should feel like.",
  },
];

function Stars({
  label,
  tone = "gold",
}: {
  label: string;
  tone?: "gold" | "cream";
}) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={label}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={
            tone === "cream"
              ? "h-4 w-4 fill-gold-300 text-gold-300"
              : "h-4 w-4 fill-gold-400 text-gold-400"
          }
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export function ReviewsSection() {
  return (
    <section className="bg-sand-100 bg-paper py-20 text-forest-900 sm:py-28">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3">
            <span className="block h-px w-12 bg-clay-500" aria-hidden="true" />
            <SectionHeading
              eyebrow="Kind words"
              title="Loved across Ottawa"
              description="Real reviews from the neighbours who keep coming back for more."
              tone="forest"
            />
          </div>

          {/* Warm dark accent card for contrast against the light surface. */}
          <Reveal
            delay={0.1}
            className="flex shrink-0 items-center gap-4 rounded-2xl border border-forest-700/50 bg-forest-800 px-6 py-5 text-cream-50 shadow-warm"
          >
            <span className="font-display text-4xl font-medium leading-none text-cream-50">
              4.8
            </span>
            <span className="flex flex-col gap-1">
              <Stars label="4.8 out of 5 stars" tone="cream" />
              <span className="text-xs uppercase tracking-[0.18em] text-cream-200/70">
                Rated on Google
              </span>
            </span>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((review, i) => (
            <Reveal
              key={review.name}
              delay={i * 0.08}
              className="group flex h-full flex-col gap-5 rounded-3xl border border-sand-300 bg-cream-50 p-7 shadow-warm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1"
            >
              <Quote
                aria-hidden="true"
                className="h-8 w-8 fill-clay-500 text-clay-500"
                strokeWidth={0}
              />
              <p className="flex-1 text-pretty text-[0.95rem] leading-relaxed text-forest-700">
                {review.quote}
              </p>
              <div className="flex items-center gap-3 border-t border-sand-300 pt-5">
                {/* Real customer photo. Path contains a space — plain <img> handles it. */}
                <img
                  src={review.photo}
                  alt={review.name}
                  loading="lazy"
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-gold-400/50"
                />
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-forest-900">
                    {review.name}
                  </span>
                  <span className="text-xs text-forest-500">
                    {review.meta} · Google review
                  </span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

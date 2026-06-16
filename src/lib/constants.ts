/**
 * Central site configuration. Edit contact details, hours and links here —
 * everything on the site reads from this file.
 */

export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Namche Kitchen",
  tagline: "Flavours Beyond Borders",
  description:
    "Namche Kitchen brings the rich flavours of Nepal and Asia to Ottawa — traditional Nepali momo and Hakka noodles, freshly prepared shawarma, burgers, wings, butter chicken and chilli. Made with fresh ingredients and bold spices. Dine in, take out, or order online.",
  orderUrl:
    process.env.NEXT_PUBLIC_ORDER_URL ?? "https://online.namchekitchen.ca",
  phone: "(613) 761-1616",
  phoneHref: "tel:+16137611616",
  email: "namcheottawa@gmail.com",
  address: {
    line1: "1230 Wellington St. W",
    line2: "Ottawa, ON K1Y 3A1",
    mapHref: "https://maps.google.com/?q=Namche+Kitchen+1230+Wellington+St+W+Ottawa",
  },
  // Map pin — keep this in sync with `address` above. (Wellington West, Ottawa.)
  geo: { lat: 45.4017, lng: -75.7286 },
  hours: [{ days: "Every day", time: "11:00 AM – 10:00 PM" }],
  social: {
    instagram: "https://instagram.com/namchekitchen",
    facebook: "https://facebook.com/namchekitchen",
    tiktok: "https://tiktok.com/@namchekitchen",
  },
} as const;

/**
 * Site-wide promo bar shown above the header. Set `enabled: false` to hide it.
 * `id` is used to remember a guest's dismissal — bump it to re-show the bar.
 */
export const ANNOUNCEMENT = {
  enabled: true,
  id: "2026-ottawa-open",
  messages: [
    "Open every day, 11 AM – 10 PM on Wellington St. W, Ottawa",
    "Hand-folded momo, made fresh every day",
    "Order online for pickup & delivery — DoorDash & Uber Eats too",
  ],
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/reservations", label: "Book a Table" },
  { href: "/catering", label: "Catering" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/** Known dietary / highlight tags and how to render them. */
export const TAG_META: Record<string, { label: string; className: string }> = {
  halal: {
    label: "Halal",
    className: "bg-forest-100 text-forest-700",
  },
  vegetarian: {
    label: "Vegetarian",
    className: "bg-forest-100 text-forest-600",
  },
  vegan: {
    label: "Vegan",
    className: "bg-forest-100 text-forest-600",
  },
  spicy: {
    label: "Spicy",
    className: "bg-spice-500/12 text-spice-600",
  },
  popular: {
    label: "Popular",
    className: "bg-gold-400/20 text-gold-600",
  },
  new: {
    label: "New",
    className: "bg-gold-400/20 text-gold-600",
  },
};

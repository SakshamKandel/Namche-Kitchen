/**
 * Central site configuration. Edit contact details, hours and links here —
 * everything on the site reads from this file.
 */

export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Namche Kitchen",
  tagline: "Himalayan kitchen, made with heart",
  description:
    "Authentic Himalayan and Middle-Eastern comfort food — momo, chowmein, shawarma, curries and more. Dine in, take out, or order online.",
  // TODO: replace the placeholders below with the restaurant's real details.
  orderUrl:
    process.env.NEXT_PUBLIC_ORDER_URL ?? "https://online.namchekitchen.ca",
  phone: "(403) 555-0142",
  phoneHref: "tel:+14035550142",
  email: "hello@namchekitchen.ca",
  address: {
    line1: "1140 Kensington Rd NW",
    line2: "Calgary, AB T2N 3P5",
    mapHref: "https://maps.google.com/?q=Namche+Kitchen+Calgary",
  },
  // Map pin — keep this in sync with `address` above. (Kensington, Calgary.)
  geo: { lat: 51.0526, lng: -114.0935 },
  hours: [
    { days: "Mon – Thu", time: "11:30 AM – 9:00 PM" },
    { days: "Fri – Sat", time: "11:30 AM – 10:00 PM" },
    { days: "Sunday", time: "12:00 PM – 9:00 PM" },
  ],
  social: {
    instagram: "https://instagram.com/namchekitchen",
    facebook: "https://facebook.com/namchekitchen",
  },
} as const;

/**
 * Site-wide promo bar shown above the header. Set `enabled: false` to hide it.
 * `id` is used to remember a guest's dismissal — bump it to re-show the bar.
 */
export const ANNOUNCEMENT = {
  enabled: true,
  id: "summer-2026-free-delivery",
  messages: [
    "Free delivery on orders over $40 across Calgary",
    "Hand-folded momo, made fresh every morning",
    "Now taking table reservations & catering enquiries",
  ],
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/reservations", label: "Book a Table" },
  { href: "/catering", label: "Catering" },
  { href: "/about", label: "Our Story" },
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

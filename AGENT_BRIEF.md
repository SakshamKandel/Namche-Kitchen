# Namche Kitchen — Sub-agent build brief

You are building **page UIs** for a restaurant website. The entire backend,
design system and shared components already exist and are typechecked. **Do not
modify shared files** — only create the page files and page-specific components
assigned to you. Project root: `E:/Namche Kitchen`. Path alias `@/*` → `src/*`.

## Stack
Next.js 15 (App Router) · React 19 · TypeScript · Tailwind **v4** · Prisma 6 (SQLite)
· framer-motion 12 · lucide-react. Node/npm (NOT bun). Server Components by default;
add `"use client"` only for interactive pieces.

## Brand & aesthetic
Modern, minimal, elegant — **cream paper primary, deep forest-green secondary, brass-gold
accent**, Himalayan/mountain mood (Namche = gateway to Everest). Serif display +
clean sans. Generous whitespace, soft rounded corners (`rounded-3xl`), gentle shadows,
tasteful scroll reveals. Think a polished, calm, premium local restaurant — NOT loud or
cluttered. Avoid stock-photo dependency; the design must look intentional with zero photos
(dishes without an uploaded image render an on-brand placeholder automatically).

## Color tokens (Tailwind classes — already configured)
- Cream: `cream-50` (page bg) `cream-100 cream-200 cream-300 cream-400`
- Forest: `forest-50 … forest-950` (700/800/900 are the deep greens)
- Gold: `gold-300 gold-400 gold-500 gold-600`
- Spice: `spice-400 spice-500 spice-600`
- Fonts: `font-display` (Fraunces serif) for headings, `font-sans` (Inter) default body.
- Helpers: `.bg-grain` `.bg-ridges` (subtle texture), `.shadow-soft` `.shadow-lift`,
  `.text-balance` `.text-pretty`. Page background is already cream.

## Shared components (import & reuse — do NOT recreate)
- `@/components/ui/Container` — `<Container size="narrow|default|wide">` page width wrapper (has px).
- `@/components/ui/SectionHeading` — `{ eyebrow?, title, description?, align?: "left"|"center", tone?: "forest"|"cream" }`.
- `@/components/ui/Button` — `<Button variant size>` and `buttonClasses({variant,size,className})`
  for styling `<Link>`/`<a>`. Variants: `primary` (forest) `gold` `outline` `ghost` `cream`. Sizes `sm|md|lg`.
- `@/components/site/OrderButton` — `<OrderButton variant size label showIcon />`. Deep-links to the
  external ordering portal (`SITE.orderUrl`). Use this for every "Order Online / Order Now" CTA.
- `@/components/ui/TagBadges` — `<TagBadges tags={item.tags} />` renders dietary chips.
- `@/components/menu/MenuItemCard` — `<MenuItemCard item={dish} />` photo card (featured/grid). Exports type `DishLike`.
- `@/components/menu/MenuItemRow` — `<MenuItemRow item={dish} />` compact list row w/ dotted price leader.
- `@/components/menu/DishImage` — `<DishImage src alt className />` photo or branded placeholder.
- `@/components/motion/Reveal` — `<Reveal delay y as>` scroll fade-in (client). Wrap sections/cards.
- `@/components/brand/Logo` and `MountainMark` (`tone="forest"|"cream"`).

## Data access (Server Components only — call directly, they're async)
- `import { getCategoriesWithItems, getFeaturedItems, getReservations, getCateringInquiries, getAdminStats } from "@/lib/queries"`
- `getCategoriesWithItems({ onlyAvailable: true })` → `Category[]` each with `.items[]`.
  Category: `{ id, name, slug, tagline, sortOrder, items }`.
  MenuItem: `{ id, name, description, price (number|null), priceLabel (string|null), imageUrl (string|null),
  options (string|null), tags (string|null comma-sep), featured, available, sortOrder, categoryId }`.
- `getFeaturedItems(6)` → featured MenuItems (each includes `.category`).
- `getAdminStats()` → `{ reservations, pending, catering, items, categories }`.
- `import { SITE, NAV_LINKS, TAG_META } from "@/lib/constants"` — name, orderUrl, phone, phoneHref,
  email, address{line1,line2,mapHref}, hours[{days,time}], social{instagram,facebook}, tagline, description.
- Utils: `@/lib/utils` → `cn`, `formatPrice`, `displayPrice`, `parseTags`, `formatDate`.
- Auth (admin server pages): `import { getCurrentAdmin } from "@/lib/auth"` → session or null (also redirect-guard).

## API endpoints (for client forms — POST JSON, read `{error, issues}` on !res.ok)
- `POST /api/reservations` — `{ name, email, phone, date (yyyy-mm-dd), time, partySize (number), notes? }` → 201 `{ok,id}`
- `POST /api/catering` — `{ name, email, phone, eventDate?, eventType?, guestCount? (number), message? }` → 201
- `POST /api/auth/login` — `{ email, password }` → `{ok}` sets cookie; 401 on bad creds.
- `POST /api/auth/logout` → clears cookie.
- Admin menu CRUD (cookie-auth): `GET /api/categories` → `{categories:[{...,items}]}`;
  `POST /api/categories` `{name, tagline?, sortOrder?}`; `PATCH/DELETE /api/categories/[id]`.
  `POST /api/menu` `{name, categoryId, description?, price?, priceLabel?, imageUrl?, options?, tags?, featured?, available?}`;
  `PATCH/DELETE /api/menu/[id]`.
- Admin uploads: `POST /api/upload` (multipart `file`) → `{ok, url}` (a `/uploads/..` path). Use for dish photos.
- Admin bookings: `GET /api/reservations`, `GET /api/catering`; `PATCH /api/reservations/[id]` `{status:"pending|confirmed|cancelled"}`,
  `PATCH /api/catering/[id]` `{status:"new|contacted|booked|closed"}`; `DELETE` each.

## Conventions
- Marketing pages live under the `(site)` route group (already has header+footer via `(site)/layout.tsx`).
- Use `<Reveal>` for entrance motion; keep it subtle. Respect reduced-motion (Reveal already does).
- Forms: client components, controlled inputs, inline validation + success state, disabled while submitting,
  friendly error messages. Cream cards on the page, forest accents, gold primary CTA.
- Every page: strong `export const metadata = { title, description }`.
- Do NOT start a dev server or run `next build` (the orchestrator verifies at the end).
- Keep imports correct and TypeScript strict-clean.

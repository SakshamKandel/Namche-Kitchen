# Namche Kitchen

A modern website for **Namche Kitchen** — a Himalayan & Middle-Eastern restaurant.
Cream-and-forest design, a live editable menu, table reservations, catering enquiries,
an "Order Online" hand-off to the ordering portal, and an admin panel for the owner.

Built with **Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 · Prisma 6**.
Runs on **Node.js** (npm).

---

## Quick start

```bash
npm install            # installs deps + generates the Prisma client
npm run db:push        # creates the SQLite database (prisma/dev.db)
npm run db:seed        # loads the full menu + the admin user
npm run dev            # http://localhost:3000
```

Open:

- **Public site** → http://localhost:3000
- **Admin panel** → http://localhost:3000/admin

### Admin login

Credentials are seeded from your environment (`.env.local` locally, project env
vars on Vercel) — never commit real values:

```
ADMIN_EMAIL=admin@namchekitchen.ca
ADMIN_PASSWORD=<choose-a-strong-password>
```

> Set a strong `ADMIN_PASSWORD` in your env, then run `npm run db:seed` to store
> it (it re-hashes on every seed). Change it before going live.

---

## Editing the menu & photos

Everything on the public `/menu` page is driven by the database and editable in the admin:

1. Sign in at `/admin` → **Menu**.
2. Add / edit / delete **categories** and **items**.
3. On an item, **upload a photo** — it saves to `public/uploads` and appears instantly
   on the public menu and home page.
4. Toggle **Available** (hide from the public menu) and **Featured** (show on the home page).
5. **Bookings** shows table reservations and catering enquiries; update their status or delete them.

Prices accept either a single number (e.g. `13.99`) **or** a free-form label for
variant pricing (e.g. `Small $11 / Large $15`).

---

## Order Online

The "Order Online" buttons deep-link to the external ordering portal. Configure it in `.env`:

```
NEXT_PUBLIC_ORDER_URL=https://online.namchekitchen.ca
```

Restaurant contact details, hours and social links live in
[`src/lib/constants.ts`](src/lib/constants.ts).

---

## Project structure

```
src/
  app/
    (site)/            # public marketing site (header + footer)
      page.tsx         #   home
      menu/            #   live menu
      reservations/    #   book a table
      catering/        #   catering enquiry
      about/           #   story
    admin/             # owner panel (login + protected dashboard)
    api/               # route handlers (reservations, catering, menu, upload, auth)
  components/          # brand, ui, site, menu, home, forms, admin, motion
  lib/                 # db, auth/session, queries, validation, constants, utils
prisma/
  schema.prisma        # data model
  seed.ts              # menu + admin seed
```

---

## Scripts

| Script             | What it does                                  |
| ------------------ | --------------------------------------------- |
| `npm run dev`      | Start the dev server                          |
| `npm run build`    | Generate Prisma client + production build     |
| `npm start`        | Run the production build                      |
| `npm run db:push`  | Sync the schema to the database               |
| `npm run db:seed`  | Seed the menu + admin user                    |
| `npm run db:reset` | Wipe + recreate + reseed the database         |

---

## Deploying (Node host)

The app runs on any Node host (Render, Railway, Fly, a VPS, etc.).

For a **serverless** host (e.g. Vercel) two things change because the filesystem is ephemeral:

1. **Database** — switch from SQLite to Postgres. In `prisma/schema.prisma` set
   `provider = "postgresql"` and point `DATABASE_URL` at a Neon/Supabase connection string,
   then `npm run db:push && npm run db:seed`.
2. **Uploads** — `public/uploads` won't persist. Swap the `/api/upload` handler to a blob
   store (e.g. Vercel Blob, S3, Cloudinary) and store the returned URL on the item.

Set the production env vars (`AUTH_SECRET` to a long random string, `ADMIN_*`,
`NEXT_PUBLIC_ORDER_URL`) in your host's dashboard.

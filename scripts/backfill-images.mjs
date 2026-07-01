/**
 * Non-destructive image backfill for the live menu.
 *
 * Assigns an on-brand local photo (/public/menu/*) to every MenuItem that does
 * NOT already have an imageUrl — so any photo the owner uploaded via the admin
 * panel is preserved. Matching is by dish name first, then category slug.
 *
 * Run: node --env-file=.env.local scripts/backfill-images.mjs
 * Add  --force  to overwrite existing images too.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const FORCE = process.argv.includes("--force");

/** Pure resolver — keep in sync with the copy in prisma/seed.ts. */
export function imageForDish(name, categorySlug) {
  const n = (name || "").toLowerCase();
  const has = (...w) => w.every((s) => n.includes(s));

  if (n.includes("momo")) {
    if (has("jhol") || has("soup")) return "/menu/momo-jhol.jpg";
    if (has("pan") || has("fried")) return "/menu/momo-fried.jpg";
    if (has("chilli") || has("chili")) return "/menu/momo-chilli.jpg";
    return "/menu/momo-steam.jpg";
  }
  if (n.includes("chowmein")) return "/menu/chowmein.jpg";
  if (n.includes("noodle")) return "/menu/noodles.jpg";
  if (has("butter", "chicken")) return "/menu/butter-chicken.jpg";
  if (n.includes("paneer")) return "/menu/saag-paneer.jpg";
  if (has("chicken", "chilli") || has("chicken", "chili"))
    return "/menu/chilli-chicken.jpg";
  if (n.includes("butter")) return "/menu/butter-chicken.jpg";
  if (n.includes("donair")) return "/menu/donair.jpg";
  if (n.includes("falafel")) return "/menu/falafel.jpg";
  if (n.includes("shawarma")) {
    if (has("platter") || has("bowl") || has("family") || has("trio"))
      return "/menu/shawarma-platter.jpg";
    return "/menu/shawarma-wrap.jpg";
  }
  if (n.includes("trio") || n.includes("platter")) return "/menu/shawarma-platter.jpg";
  if (n.includes("poutine")) return "/menu/poutine.jpg";
  if (n.includes("fries") || n.includes("potato")) return "/menu/fries.jpg";
  if (n.includes("burger")) return "/menu/burger.jpg";
  if (n.includes("wing") || n.includes("strip")) return "/menu/wings.jpg";
  if (n.includes("salad") || n.includes("tabbouli")) return "/menu/salad.jpg";
  if (n.includes("tea")) return "/menu/chai.jpg";
  if (
    n.includes("juice") || n.includes("drink") || n.includes("water") ||
    n.includes("yogurt") || n.includes("nectar") || n.includes("can")
  )
    return "/menu/cold-drink.jpg";
  if (n.includes("buff")) return "/menu/buff.jpg";

  const byCat = {
    momo: "/menu/momo-steam.jpg",
    "limited-selection": "/menu/buff.jpg",
    "hakka-noodles": "/menu/noodles.jpg",
    chowmein: "/menu/chowmein.jpg",
    "curry-comforts": "/menu/butter-chicken.jpg",
    "chilli-kicks": "/menu/chilli-chicken.jpg",
    salads: "/menu/salad.jpg",
    "combo-meals": "/menu/feast.jpg",
    burgers: "/menu/burger.jpg",
    "wings-strips": "/menu/wings.jpg",
    "poutine-fries": "/menu/poutine.jpg",
    "shawarma-sandwiches": "/menu/shawarma-wrap.jpg",
    "shawarma-combo": "/menu/shawarma-platter.jpg",
    "shawarma-platters": "/menu/shawarma-platter.jpg",
    "shawarma-family-platters": "/menu/shawarma-platter.jpg",
    "shawarma-sides": "/menu/falafel.jpg",
    drinks: "/menu/chai.jpg",
  };
  return byCat[categorySlug] || "/menu/feast.jpg";
}

async function main() {
  const items = await prisma.menuItem.findMany({
    include: { category: { select: { slug: true } } },
  });

  let updated = 0;
  let skipped = 0;
  for (const item of items) {
    // Preserve owner-uploaded photos (anything not under /menu/), unless forced.
    const isOwnerUpload =
      item.imageUrl && !item.imageUrl.startsWith("/menu/");
    if (isOwnerUpload && !FORCE) {
      skipped++;
      continue;
    }
    const url = imageForDish(item.name, item.category.slug);
    await prisma.menuItem.update({
      where: { id: item.id },
      data: { imageUrl: url },
    });
    updated++;
  }

  console.log(
    `✅ backfill complete — ${updated} updated, ${skipped} left untouched (already had a photo).`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

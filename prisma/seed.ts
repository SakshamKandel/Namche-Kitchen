/**
 * Seeds the Namche Kitchen menu + an admin user.
 * Run with: npm run db:seed   (loads .env via `prisma db seed`)
 *
 * Menu transcribed from the live namchekitchen.ca menu. The owner can edit
 * every field (and upload photos) from the admin panel.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type SeedItem = {
  name: string;
  description?: string;
  price?: number;
  priceLabel?: string;
  options?: string;
  tags?: string;
  spiceLevel?: number;
  featured?: boolean;
};

type SeedCategory = {
  name: string;
  slug: string;
  tagline: string;
  items: SeedItem[];
};

const MENU: SeedCategory[] = [
  {
    name: "Momo (10 Pcs)",
    slug: "momo",
    tagline: "Hand-folded Himalayan dumplings, steamed to order",
    items: [
      { name: "Steam Momo", description: "Made with seasoned chicken and our homemade sauce, with spicy chili dip.", price: 14.99, options: "Chicken / Vegetarian", tags: "popular", featured: true },
      { name: "Soup (Jhol) Momo", description: "Served with our homemade jhol (soup).", price: 15.49, options: "Chicken / Vegetarian" },
      { name: "Pan Fried Momo", description: "Crispy pan-fried momo with house-made sauce and chili dip.", price: 15.49, options: "Chicken / Vegetarian" },
      { name: "Chilli Momo", description: "Chili-tossed momo with pepper, onion and tomato sauce.", price: 16.49, options: "Chicken / Vegetarian", tags: "spicy", spiceLevel: 2 },
    ],
  },
  {
    name: "Limited Selection",
    slug: "limited-selection",
    tagline: "Buff (water buffalo) specials, the Nepali way",
    items: [
      { name: "Buff Steam Momo", description: "Seasoned water-buffalo dumplings with our homemade sauce and spicy chili dip.", price: 19.99 },
      { name: "Buff Soup (Jhol) Momo", description: "Buff steamed momo in a spiced jhol broth.", price: 21.99 },
      { name: "Buff Chilli Momo", description: "Buff momo tossed with pepper, onion and tomato chilli sauce.", price: 22.99, tags: "spicy", spiceLevel: 2 },
      { name: "Buff Chowmein", description: "Prepared in Nepali style & flavor.", price: 16.49 },
    ],
  },
  {
    name: "Hakka Noodles",
    slug: "hakka-noodles",
    tagline: "Wok-tossed Indo-Chinese noodles",
    items: [
      { name: "Chicken Hakka Noodle", description: "Onion, bell pepper, carrot, cabbage, Himalayan spices, chicken and sauce.", price: 15.49, tags: "spicy", spiceLevel: 2, featured: true },
      { name: "Egg Hakka Noodle", description: "Onion, bell pepper, carrot, cabbage, Himalayan spices, egg and sauce.", price: 14.49, tags: "spicy", spiceLevel: 2 },
      { name: "Veg. Hakka Noodles", description: "Onion, bell pepper, carrot, cabbage, Himalayan spices and sauce.", price: 13.49, tags: "vegetarian, spicy", spiceLevel: 2 },
    ],
  },
  {
    name: "Chowmein (Nepali Style & Flavor)",
    slug: "chowmein",
    tagline: "Nepali-style stir-fried noodles",
    items: [
      { name: "Chicken Chowmein", description: "Classic Nepali chowmein with tender chicken.", price: 15.49, tags: "spicy", spiceLevel: 2, featured: true },
      { name: "Buff Chowmein", description: "Nepali chowmein with seasoned buff.", price: 16.49, tags: "spicy", spiceLevel: 2 },
      { name: "Egg Chowmein", description: "Stir-fried noodles folded with egg.", price: 14.49, tags: "spicy", spiceLevel: 2 },
      { name: "Veg Chowmein", description: "Chowmein with seasonal vegetables.", price: 13.49, tags: "vegetarian, spicy", spiceLevel: 2 },
    ],
  },
  {
    name: "Curry Comforts",
    slug: "curry-comforts",
    tagline: "Served with a bowl of rice or naan bread",
    items: [
      { name: "Butter Chicken", description: "Tender chicken breast in a velvety, spiced butter sauce, served with a bowl of rice or naan bread.", price: 19.95, tags: "popular", featured: true },
      { name: "Butter Paneer", description: "Creamy, rich tomato-based curry with soft paneer cubes, served with a bowl of rice or naan bread.", price: 19.95, tags: "vegetarian" },
    ],
  },
  {
    name: "Chilli Kicks",
    slug: "chilli-kicks",
    tagline: "Fiery wok-fried favourites with rice or naan",
    items: [
      { name: "Chicken Chilli", description: "A spicy and savory chicken, served with a bowl of rice or naan bread.", price: 19.95, tags: "spicy", spiceLevel: 2, featured: true },
      { name: "Paneer Chilli", description: "Cubes of paneer tossed in chilli sauce, served with a bowl of rice or naan bread.", price: 19.95, tags: "vegetarian, spicy", spiceLevel: 2 },
    ],
  },
  {
    name: "Salads",
    slug: "salads",
    tagline: "Fresh, crisp and light",
    items: [
      { name: "Ceaser Salad", description: "Add protein: Chicken / Beef for $3.49.", price: 8.99 },
      { name: "Green Salad", description: "Add protein: Chicken / Beef for $3.49.", price: 6.99, tags: "vegetarian" },
      { name: "Tabbouli", description: "Add protein: Chicken / Beef for $3.49.", price: 6.99, tags: "vegetarian" },
    ],
  },
  {
    name: "Combo Meals",
    slug: "combo-meals",
    tagline: "Best value, fully loaded",
    items: [
      { name: "25 Momo Combo", description: "Mix of steam, pan-fried and chilli momo.", price: 37.5, options: "Chicken / Veg" },
      { name: "15 Momo Combo", description: "Mix of steam and pan-fried momo.", price: 21.5, options: "Chicken / Veg" },
      { name: "Momo & Noodles", description: "Combo of 10 pcs momo and Hakka noodles.", price: 24.5, options: "Chicken / Veg" },
      { name: "Shawarma Platter for 5 Persons", description: "Protein options: Chicken, Beef, Mix, Donair or Falafel.", price: 74.5, options: "Chicken / Beef / Mix / Donair / Falafel", tags: "halal" },
    ],
  },
  {
    name: "Burgers",
    slug: "burgers",
    tagline: "Stacked and served with fries",
    items: [
      { name: "8848 Chicken Burger", description: "Served with fries.", price: 16.5 },
      { name: "Beef Burger", description: "Served with fries.", price: 17.5 },
    ],
  },
  {
    name: "Chicken Wings & Strips",
    slug: "wings-strips",
    tagline: "Crispy, saucy, shareable",
    items: [
      { name: "10 Pcs Chicken Wings", description: "Flavours: Hot, BBQ, Honey Garlic, Sweet Thai Chilli.", price: 14.49, options: "Hot / BBQ / Honey Garlic / Sweet Thai Chilli", tags: "spicy", spiceLevel: 2 },
      { name: "Chicken Strips (6 Pcs)", description: "Served with fries.", price: 14.49 },
    ],
  },
  {
    name: "Poutine & Fries",
    slug: "poutine-fries",
    tagline: "Canadian comfort, Namche style",
    items: [
      { name: "Namche Poutine", description: "Crispy french fries, gravy and Montreal cheese curd.", priceLabel: "Small $11.49 / Large $13.49", tags: "popular", featured: true },
      { name: "Chicken Poutine", description: "Crispy fries, gravy, chicken and Montreal cheese curd.", priceLabel: "Small $14.49 / Large $16.49" },
      { name: "Beef Poutine", description: "Crispy fries, gravy, beef and Montreal cheese curd.", priceLabel: "Small $14.49 / Large $16.49" },
      { name: "Fries", description: "Small portion of fries with ketchup.", price: 5.49, tags: "vegetarian" },
    ],
  },
  {
    name: "Shawarma — Sandwiches",
    slug: "shawarma-sandwiches",
    tagline: "Wrapped fresh — always halal",
    items: [
      { name: "Chicken Shawarma", description: "Protein options: Chicken, Beef, Mix, Donair or Falafel.", priceLabel: "Small $9.99 / Large $13.99", options: "Chicken / Beef / Mix / Donair / Falafel", tags: "halal" },
      { name: "Beef / Mix Shawarma", description: "Protein options: Chicken, Beef, Mix, Donair or Falafel.", priceLabel: "Small $10.49 / Large $14.49", options: "Chicken / Beef / Mix / Donair / Falafel", tags: "halal" },
      { name: "Donair", description: "Protein options: Chicken, Beef, Mix, Donair or Falafel.", priceLabel: "Small $8.99 / Large $13.99", options: "Chicken / Beef / Mix / Donair / Falafel", tags: "halal" },
      { name: "Falafel", description: "Crispy chickpea falafel wrap.", priceLabel: "Small $8.99 / Large $13.99", tags: "halal, vegetarian, vegan" },
    ],
  },
  {
    name: "Shawarma — Combo",
    slug: "shawarma-combo",
    tagline: "Trios with sides",
    items: [
      { name: "Small Trio", priceLabel: "Chicken $15.49 / Beef-Mix $16.49", options: "Chicken / Beef-Mix", tags: "halal" },
      { name: "Large Trio", priceLabel: "Chicken $18.99 / Beef-Mix $19.99", options: "Chicken / Beef-Mix", tags: "halal" },
    ],
  },
  {
    name: "Shawarma — Platters",
    slug: "shawarma-platters",
    tagline: "Served as a platter or a bowl",
    items: [
      { name: "Chicken Shawarma", priceLabel: "Platter $21.99 / Bowl $17.99", tags: "halal", featured: true },
      { name: "Beef Shawarma", priceLabel: "Platter $22.49 / Bowl $18.49", tags: "halal" },
      { name: "Mixed Shawarma", priceLabel: "Platter $22.49 / Bowl $18.49", tags: "halal" },
      { name: "Falafel", priceLabel: "Platter $19.99", tags: "halal, vegetarian, vegan" },
    ],
  },
  {
    name: "Shawarma — Family Platters",
    slug: "shawarma-family-platters",
    tagline: "Feasts to share",
    items: [
      { name: "Family Platter for 5", priceLabel: "Chicken $69.99 / Beef-Mix $74.99", options: "Chicken / Beef-Mix", tags: "halal" },
      { name: "Family Platter for 8", priceLabel: "Chicken $95.99 / Beef-Mix $99.99", options: "Chicken / Beef-Mix", tags: "halal" },
      { name: "Half Family Plate", priceLabel: "Chicken $42.99 / Beef-Mix $44.99", options: "Chicken / Beef-Mix", tags: "halal" },
    ],
  },
  {
    name: "Shawarma — Sides",
    slug: "shawarma-sides",
    tagline: "Little extras",
    items: [
      { name: "Garlic Potatoes", price: 6.49, tags: "vegetarian" },
      { name: "Turnips", priceLabel: "Small $6.00", tags: "vegetarian" },
      { name: "Grape Leaves (6 Pieces)", priceLabel: "Small $5.99", tags: "halal" },
      { name: "Falafel (1 Piece)", priceLabel: "Small $2.00", tags: "halal, vegetarian, vegan" },
    ],
  },
  {
    name: "Masala Tea & Drinks",
    slug: "drinks",
    tagline: "Brewed and poured",
    items: [
      { name: "Milk Masala Tea", description: "A spiced milk tea infused with warming Himalayan aromatics.", price: 3.49 },
      { name: "Black Masala Tea", description: "A spiced black tea infused with warming Himalayan aromatics.", price: 2.49 },
      { name: "Nectar Juice", price: 4.49 },
      { name: "Yogurt Drink", price: 4.49 },
      { name: "Can Drink", price: 2.49 },
      { name: "Water", price: 2.49 },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding Namche Kitchen…");

  // Reset menu (keeps reservations / catering / subscribers intact)
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();

  for (const [ci, cat] of MENU.entries()) {
    await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        tagline: cat.tagline,
        sortOrder: ci,
        items: {
          create: cat.items.map((item, ii) => ({
            name: item.name,
            description: item.description ?? null,
            price: item.price ?? null,
            priceLabel: item.priceLabel ?? null,
            options: item.options ?? null,
            tags: item.tags ?? null,
            spiceLevel: item.spiceLevel ?? 0,
            featured: item.featured ?? false,
            available: true,
            sortOrder: ii,
          })),
        },
      },
    });
  }

  const categoryCount = MENU.length;
  const itemCount = MENU.reduce((n, c) => n + c.items.length, 0);
  console.log(`   ✓ ${categoryCount} categories, ${itemCount} items`);

  // Admin user
  const email = process.env.ADMIN_EMAIL ?? "admin@namchekitchen.ca";
  const password = process.env.ADMIN_PASSWORD ?? "change-me-please";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "Namche Admin" },
  });
  console.log(`   ✓ admin user: ${email}`);

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/**
 * Seeds the Namche Kitchen menu + an admin user.
 * Run with: npm run db:seed   (loads .env via `prisma db seed`)
 *
 * Prices are realistic CAD estimates transcribed from the menu — the owner
 * can edit every field (and upload photos) from the admin panel.
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
      {
        name: "Steam Momo",
        description:
          "Ten delicate dumplings steamed to order, served with our house tomato–sesame achar.",
        price: 13.99,
        options: "Chicken / Veg",
        tags: "popular",
        featured: true,
      },
      {
        name: "Soup (Jhol) Momo",
        description: "Momo bathed in a warm, spiced jhol broth.",
        price: 15.99,
        options: "Chicken / Veg",
        tags: "spicy",
      },
      {
        name: "Pan-Fried Momo",
        description: "Crisp-bottomed, pan-seared dumplings.",
        price: 15.49,
        options: "Chicken / Veg",
      },
      {
        name: "Chilli Momo",
        description:
          "Wok-tossed in a sweet-and-spicy chilli glaze with peppers and onion.",
        price: 15.49,
        options: "Chicken / Veg",
        tags: "spicy",
      },
    ],
  },
  {
    name: "Limited Selection",
    slug: "limited-selection",
    tagline: "Buff (buffalo) specials, the Nepali way",
    items: [
      {
        name: "Buff Steam Momo",
        description: "Steamed buff dumplings with classic Kathmandu seasoning.",
        price: 14.99,
      },
      {
        name: "Buff Soup (Jhol) Momo",
        description: "Buff momo in a spiced jhol broth.",
        price: 16.99,
        tags: "spicy",
      },
      {
        name: "Buff Chilli Momo",
        description: "Buff momo tossed in a fiery chilli sauce.",
        price: 16.49,
        tags: "spicy",
      },
      {
        name: "Buff Chowmein",
        description: "Buff chowmein, Nepali street-style.",
        price: 14.49,
      },
    ],
  },
  {
    name: "Hakka Noodles",
    slug: "hakka-noodles",
    tagline: "Wok-tossed Indo-Chinese noodles",
    items: [
      {
        name: "Chicken Hakka Noodle",
        description: "Springy noodles wok-tossed with chicken and crunchy veg.",
        price: 15.49,
      },
      {
        name: "Egg Hakka Noodle",
        description: "Hakka noodles folded through wok-fried egg.",
        price: 13.49,
      },
      {
        name: "Veg Hakka Noodle",
        description: "Garden vegetables tossed through Hakka noodles.",
        price: 12.99,
        tags: "vegetarian",
      },
    ],
  },
  {
    name: "Chowmein",
    slug: "chowmein",
    tagline: "Nepali-style stir-fried noodles",
    items: [
      {
        name: "Chicken Chowmein",
        description: "Classic Nepali chowmein with tender chicken.",
        price: 13.49,
        tags: "popular",
        featured: true,
      },
      {
        name: "Buff Chowmein",
        description: "Nepali chowmein with seasoned buff.",
        price: 13.49,
      },
      {
        name: "Egg Chowmein",
        description: "Stir-fried noodles folded with egg.",
        price: 12.49,
      },
      {
        name: "Veg Chowmein",
        description: "Veg chowmein with seasonal vegetables.",
        price: 11.99,
        tags: "vegetarian",
      },
    ],
  },
  {
    name: "Curry Comforts",
    slug: "curry-comforts",
    tagline: "Slow-simmered curries with rice or naan",
    items: [
      {
        name: "Butter Chicken",
        description:
          "Tandoori chicken in a velvety tomato-butter gravy, served with basmati rice.",
        price: 16.99,
        tags: "popular",
        featured: true,
      },
      {
        name: "Paneer Butter Masala",
        description: "Paneer in a rich, mildly spiced tomato-cream sauce.",
        price: 15.99,
        tags: "vegetarian",
      },
      {
        name: "Chicken Curry (Nepali)",
        description: "Home-style Nepali chicken curry with bold spices.",
        price: 16.49,
        tags: "spicy",
      },
      {
        name: "Chana Masala",
        description: "Chickpeas simmered in a tangy, fragrant masala.",
        price: 14.49,
        tags: "vegan, vegetarian",
      },
    ],
  },
  {
    name: "Chilli Kicks",
    slug: "chilli-kicks",
    tagline: "Fiery wok-fried favourites",
    items: [
      {
        name: "Chicken Chilli",
        description:
          "Crispy chicken tossed with peppers, onion and a chilli-garlic sauce.",
        price: 16.99,
        tags: "spicy, popular",
        featured: true,
      },
      {
        name: "Paneer Chilli",
        description: "Golden paneer in a glossy chilli glaze.",
        price: 15.99,
        tags: "spicy, vegetarian",
      },
      {
        name: "Buff Chilli",
        description: "Wok-fried buff in a spicy chilli sauce.",
        price: 16.49,
        tags: "spicy",
      },
    ],
  },
  {
    name: "Salads",
    slug: "salads",
    tagline: "Fresh, crisp and light",
    items: [
      {
        name: "Caesar Salad",
        description:
          "Romaine, parmesan and croutons in a creamy Caesar dressing.",
        price: 10.99,
        tags: "vegetarian",
      },
      {
        name: "Green Salad",
        description: "Garden greens with a house vinaigrette.",
        price: 8.99,
        tags: "vegan, vegetarian",
      },
      {
        name: "Tabbouli",
        description:
          "Parsley, bulgur, tomato and mint with lemon and olive oil.",
        price: 9.99,
        tags: "vegan, vegetarian",
      },
    ],
  },
  {
    name: "Combo Meals",
    slug: "combo-meals",
    tagline: "Best value, fully loaded",
    items: [
      {
        name: "15-Momo Combo",
        description: "Fifteen momo with fries and a drink.",
        priceLabel: "Chicken $19.99 / Veg $18.99",
        options: "Chicken / Veg",
      },
      {
        name: "10-Momo Combo",
        description: "Ten momo with fries and a drink.",
        priceLabel: "Chicken $16.99 / Veg $15.99",
        options: "Chicken / Veg",
      },
      {
        name: "Momo & Noodles",
        description: "Momo paired with chowmein — the best of both.",
        priceLabel: "Chicken $18.99 / Veg $17.99",
        options: "Chicken / Veg",
      },
      {
        name: "Shawarma Platter Combo",
        description: "A shawarma platter with a drink.",
        price: 17.49,
        tags: "halal",
      },
    ],
  },
  {
    name: "Burgers",
    slug: "burgers",
    tagline: "Stacked and served with seasoned fries",
    items: [
      {
        name: "Grilled Chicken Burger",
        description:
          "Grilled chicken, lettuce, tomato and house sauce, with fries.",
        price: 13.99,
      },
      {
        name: "Beef Burger",
        description: "Seasoned beef patty with all the fixings, with fries.",
        price: 13.99,
      },
    ],
  },
  {
    name: "Chicken Wings & Strips",
    slug: "wings-strips",
    tagline: "Crispy, saucy, shareable",
    items: [
      {
        name: "Chicken Wings (10 pcs)",
        description: "Ten wings tossed in your choice of sauce.",
        price: 13.49,
        options: "Mild / Hot / BBQ",
        tags: "spicy",
      },
      {
        name: "Chicken Strips (6 pcs)",
        description: "Six breaded strips with fries and dip.",
        price: 12.49,
      },
    ],
  },
  {
    name: "Poutine & Fries",
    slug: "poutine-fries",
    tagline: "Canadian comfort, Namche style",
    items: [
      {
        name: "Namche Poutine",
        description: "Crispy fries, cheese curds and rich gravy.",
        priceLabel: "Small $11.49 / Large $15.49",
        tags: "popular",
        featured: true,
      },
      {
        name: "Chicken Poutine",
        description: "Poutine loaded with seasoned chicken.",
        priceLabel: "Small $13.49 / Large $16.49",
      },
      {
        name: "Beef Poutine",
        description: "Poutine piled with seasoned beef.",
        priceLabel: "Small $13.49 / Large $16.49",
      },
      {
        name: "Fries",
        description: "Golden, seasoned fries.",
        price: 6.49,
        tags: "vegetarian",
      },
    ],
  },
  {
    name: "Shawarma Sandwiches",
    slug: "shawarma-sandwiches",
    tagline: "Wrapped fresh — always Halal",
    items: [
      {
        name: "Chicken Shawarma",
        description:
          "Marinated chicken, garlic sauce, pickles and veg in a warm wrap.",
        priceLabel: "Small $8.99 / Large $11.99",
        options: "Small / Large",
        tags: "halal",
      },
      {
        name: "Beef Shawarma",
        description: "Spiced beef shawarma with tahini and veg.",
        priceLabel: "Small $10.99 / Large $12.99",
        options: "Small / Large",
        tags: "halal",
      },
      {
        name: "Donair",
        description: "Sweet donair sauce, tomato and onion in a soft wrap.",
        priceLabel: "Small $8.99 / Large $11.99",
        options: "Small / Large",
        tags: "halal",
      },
      {
        name: "Falafel Wrap",
        description: "Crispy falafel, hummus and fresh salad.",
        priceLabel: "Small $8.99 / Large $10.99",
        options: "Small / Large",
        tags: "halal, vegan, vegetarian",
      },
    ],
  },
  {
    name: "Shawarma Platters",
    slug: "shawarma-platters",
    tagline: "Served with rice, salad and sauces",
    items: [
      {
        name: "Chicken Shawarma Platter",
        description:
          "Chicken shawarma over rice with salad, garlic sauce and pita.",
        price: 21.99,
        tags: "halal",
        featured: true,
      },
      {
        name: "Beef Shawarma Platter",
        description: "Beef shawarma platter with all the trimmings.",
        price: 23.99,
        tags: "halal",
      },
      {
        name: "Mixed Shawarma Platter",
        description: "Chicken and beef shawarma over rice.",
        price: 24.99,
        tags: "halal",
      },
      {
        name: "Falafel Platter",
        description: "Falafel platter with hummus, salad and rice.",
        price: 19.99,
        tags: "halal, vegan, vegetarian",
      },
    ],
  },
  {
    name: "Family Platters",
    slug: "family-platters",
    tagline: "Feasts to share",
    items: [
      {
        name: "Family Platter for 3",
        description:
          "A shawarma feast for three with rice, salad, pita and sauces.",
        priceLabel: "Chicken $54.99 / Beef $59.99",
        options: "Chicken / Beef",
        tags: "halal",
      },
      {
        name: "Family Platter for 5",
        description: "A generous spread for five.",
        priceLabel: "Chicken $79.99 / Beef $89.99",
        options: "Chicken / Beef",
        tags: "halal",
      },
      {
        name: "Half Family Platter",
        description: "A lighter share platter.",
        priceLabel: "Chicken $42.99 / Beef $46.99",
        options: "Chicken / Beef",
        tags: "halal",
      },
    ],
  },
  {
    name: "Sides",
    slug: "sides",
    tagline: "Little extras",
    items: [
      {
        name: "Garlic Paneer",
        description: "Pan-fried paneer in garlic butter.",
        price: 9.49,
        tags: "vegetarian",
      },
      {
        name: "Samosa (2 pcs)",
        description: "Crisp pastry with spiced potato and peas.",
        price: 4.99,
        tags: "vegan, vegetarian",
      },
      {
        name: "Onion Rings",
        description: "Golden battered onion rings.",
        price: 6.99,
        tags: "vegetarian",
      },
      {
        name: "Falafel (5 pcs)",
        description: "Crispy chickpea falafel with tahini.",
        price: 5.99,
        tags: "halal, vegan, vegetarian",
      },
    ],
  },
  {
    name: "Masala Tea & Drinks",
    slug: "drinks",
    tagline: "Brewed and poured",
    items: [
      {
        name: "Milk Masala Tea",
        description: "Spiced Himalayan milk tea.",
        price: 3.49,
        tags: "vegetarian",
      },
      {
        name: "Black Masala Tea",
        description: "Spiced black tea.",
        price: 2.99,
        tags: "vegan, vegetarian",
      },
      {
        name: "Seasonal Juice",
        description: "Ask your server for today's juice.",
        price: 4.49,
      },
      {
        name: "Vegan Drink",
        description: "A plant-based refresher.",
        price: 4.49,
        tags: "vegan",
      },
      {
        name: "Canned Pop",
        description: "Coke, Diet Coke, Sprite or Fanta.",
        price: 2.49,
      },
      {
        name: "Bottled Water",
        description: "Still spring water.",
        price: 1.99,
      },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding Namche Kitchen…");

  // Reset menu (keeps reservations/catering intact)
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

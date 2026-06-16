import { z } from "zod";

/** Treat "" / null / undefined as "not provided". */
const emptyToUndef = (v: unknown) =>
  v === "" || v === null || v === undefined ? undefined : v;

const optionalText = z.preprocess(
  emptyToUndef,
  z.string().trim().max(2000).optional()
);

const optionalCount = z.preprocess(
  emptyToUndef,
  z.coerce.number().int().min(1).max(5000).optional()
);

export const newsletterSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  source: z.preprocess(emptyToUndef, z.string().max(60).optional()),
});

export const reservationSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().min(7, "Enter a valid phone").max(30),
  date: z.string().min(1, "Pick a date"),
  time: z.string().min(1, "Pick a time"),
  partySize: z.coerce.number().int().min(1).max(50),
  notes: optionalText,
});

export const cateringSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().min(7, "Enter a valid phone").max(30),
  eventDate: z.preprocess(emptyToUndef, z.string().optional()),
  eventType: optionalText,
  guestCount: optionalCount,
  message: optionalText,
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const menuItemSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: optionalText.nullable(),
  price: z.preprocess(
    emptyToUndef,
    z.coerce.number().min(0).max(100000).optional()
  ).nullable(),
  priceLabel: z.preprocess(emptyToUndef, z.string().max(120).optional()).nullable(),
  imageUrl: z.preprocess(emptyToUndef, z.string().max(500).optional()).nullable(),
  options: z.preprocess(emptyToUndef, z.string().max(200).optional()).nullable(),
  tags: z.preprocess(emptyToUndef, z.string().max(200).optional()).nullable(),
  spiceLevel: z.coerce.number().int().min(0).max(3).optional(),
  categoryId: z.string().min(1, "Choose a category"),
  featured: z.boolean().optional(),
  available: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const menuItemUpdateSchema = menuItemSchema.partial();

export const categorySchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z.preprocess(emptyToUndef, z.string().max(120).optional()),
  tagline: z.preprocess(emptyToUndef, z.string().max(200).optional()).nullable(),
  sortOrder: z.coerce.number().int().optional(),
});

export const reservationStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled"]),
});

export const cateringStatusSchema = z.object({
  status: z.enum(["new", "contacted", "booked", "closed"]),
});

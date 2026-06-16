import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SITE } from "@/lib/constants";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://namchekitchen.ca"),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    type: "website",
    locale: "en_CA",
  },
  // Favicon + apple-touch-icon are provided by src/app/icon.png and
  // src/app/apple-icon.png (white logo on forest), auto-wired by Next.
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-cream-50 text-forest-950 antialiased">
        {children}
      </body>
    </html>
  );
}

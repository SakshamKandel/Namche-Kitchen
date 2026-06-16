import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { OrderButton } from "./OrderButton";
import { OpenStatus } from "./OpenStatus";
import { Container } from "@/components/ui/Container";
import { DoodleScatter } from "@/components/decor/DoodleScatter";
import { NewsletterSignup } from "@/components/forms/NewsletterSignup";
import { NAV_LINKS, SITE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="relative isolate mt-24 border-t border-cream-200 bg-cream-50">
      <DoodleScatter preset="footer" />

      {/* Newsletter band */}
      <div className="border-b border-cream-200">
        <Container className="py-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-semibold text-forest-900 sm:text-3xl">
                Join our table
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-forest-600">
                Seasonal specials, new dishes and the occasional momo secret —
                straight to your inbox. No spam, just good food news.
              </p>
            </div>
            <NewsletterSignup source="footer" className="lg:justify-self-end lg:w-full lg:max-w-md" />
          </div>
        </Container>
      </div>

      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo tone="forest" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-forest-500">
              {SITE.description}
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-forest-500 transition-colors hover:bg-forest-50 hover:text-forest-800"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-forest-500 transition-colors hover:bg-forest-50 hover:text-forest-800"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-forest-400">
              Explore
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-forest-600 transition-colors hover:text-forest-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-forest-400">
              Find Us
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-forest-600">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-forest-400" />
                <a href={SITE.address.mapHref} target="_blank" rel="noopener noreferrer" className="hover:text-forest-900">
                  {SITE.address.line1}
                  <br />
                  {SITE.address.line2}
                </a>
              </li>
              <li className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-forest-400" />
                <a href={SITE.phoneHref} className="hover:text-forest-900">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-forest-400" />
                <a href={`mailto:${SITE.email}`} className="hover:text-forest-900">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-forest-400">
              Hours
            </h3>
            <OpenStatus variant="inline" className="mt-3" />
            <ul className="mt-4 space-y-2 text-sm text-forest-600">
              {SITE.hours.map((h) => (
                <li key={h.days} className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-forest-400" />
                  <span className="flex-1">
                    <span className="font-medium text-forest-800">{h.days}</span>
                    <span className="block text-forest-500">{h.time}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <OrderButton size="sm" />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream-200 pt-6 text-xs text-forest-400 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-4">
            <Link href="/admin" className="transition-colors hover:text-forest-700">
              Staff Login
            </Link>
            <span className="text-forest-300">&middot;</span>
            <span>Made with care in Calgary</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}

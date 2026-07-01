import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { OrderButton } from "./OrderButton";
import { Container } from "@/components/ui/Container";
import { NewsletterSignup } from "@/components/forms/NewsletterSignup";
import { NAV_LINKS, SITE } from "@/lib/constants";

const social = [
  { href: SITE.social.instagram, label: "Instagram", Icon: Instagram },
  { href: SITE.social.facebook, label: "Facebook", Icon: Facebook },
];

const deliveryPartners = [
  { href: "https://www.doordash.com", label: "DoorDash" },
  { href: "https://www.ubereats.com", label: "Uber Eats" },
];

export function SiteFooter() {
  return (
    <footer className="relative isolate bg-forest-950 text-cream-200">
      {/* Newsletter band */}
      <div className="border-b border-cream-50/10">
        <Container className="py-14">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
                Join our table
              </span>
              <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-cream-50 sm:text-4xl">
                Stay in the loop
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-cream-200/70">
                Seasonal specials, new dishes and the occasional momo secret —
                straight to your inbox. No spam, just good food news.
              </p>
            </div>
            <NewsletterSignup
              source="footer"
              className="lg:w-full lg:max-w-md lg:justify-self-end"
            />
          </div>
        </Container>
      </div>

      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo tone="cream" className="h-12" />
            <p className="mt-2 font-display text-lg tracking-tight text-cream-50">
              {SITE.tagline}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-200/65">
              {SITE.description}
            </p>
            <div className="mt-6 flex gap-2.5">
              {social.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream-50/15 text-cream-200/80 transition-colors hover:border-gold-400/50 hover:text-gold-400"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
              Explore
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream-200/75 transition-colors hover:text-cream-50"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
              Visit
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-cream-200/75">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400/80" />
                <a
                  href={SITE.address.mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-cream-50"
                >
                  {SITE.address.line1}
                  <br />
                  {SITE.address.line2}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-400/80" />
                <span>
                  {SITE.hours.map((h) => (
                    <span key={h.days} className="block">
                      <span className="text-cream-50">{h.days}</span>
                      <span className="block text-cream-200/65">{h.time}</span>
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-400/80" />
                <a
                  href={SITE.phoneHref}
                  className="transition-colors hover:text-cream-50"
                >
                  {SITE.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400/80" />
                <a
                  href={`mailto:${SITE.email}`}
                  className="transition-colors hover:text-cream-50"
                >
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Order */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
              Order
            </h3>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream-200/70">
              Pickup &amp; delivery, straight from our kitchen — or find us on
              your favourite app.
            </p>
            <div className="mt-5">
              <OrderButton variant="gold" size="sm" />
            </div>
            <ul className="mt-5 space-y-2.5 text-sm">
              {deliveryPartners.map((p) => (
                <li key={p.label}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-cream-200/75 transition-colors hover:text-cream-50"
                  >
                    {p.label}
                    <ExternalLink className="h-3.5 w-3.5 text-cream-200/40" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Gold hairline */}
        <span className="mt-14 block h-px w-full bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />

        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-cream-200/55 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-4">
            <Link
              href="/admin"
              className="transition-colors hover:text-cream-50"
            >
              Staff Login
            </Link>
            <span className="text-cream-200/30">&middot;</span>
            <span>Made with care in Ottawa</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}

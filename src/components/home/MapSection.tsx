"use client";

import { Map, MapMarker, MarkerContent, MarkerPopup, MarkerTooltip, MapControls } from "@/components/ui/mapcn-map-marker";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { MapPin } from "lucide-react";
import { SITE } from "@/lib/constants";

const LOCATION = {
  lat: SITE.geo.lat,
  lng: SITE.geo.lng,
  name: SITE.name,
  address: SITE.address.line1,
  city: SITE.address.line2,
};

export function MapSection({ showHeading = true }: { showHeading?: boolean }) {
  const city = SITE.address.line2.split(",")[0].trim();
  return (
    <section className="bg-white py-12 sm:py-16">
      <Container>
        {showHeading && (
          <div className="mb-8 text-center">
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-forest-400">
                Find us
              </p>
            </Reveal>
            <Reveal delay={0.04}>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-forest-900 sm:text-5xl">
                Visit us in {city}
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mx-auto mt-3 max-w-md text-lg leading-relaxed text-forest-500">
                Find us on {LOCATION.address}. Come by for dine-in or pick up your
                order.
              </p>
            </Reveal>
          </div>
        )}

        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-cream-200 shadow-subtle">
            <div className="h-[320px] w-full sm:h-[420px]">
              <Map
                center={[LOCATION.lng, LOCATION.lat]}
                zoom={15}
                theme="light"
                className="h-full w-full"
              >
                <MapMarker longitude={LOCATION.lng} latitude={LOCATION.lat}>
                  <MarkerContent>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-forest-800 shadow-lg">
                      <MapPin className="h-4 w-4 text-cream-50" />
                    </div>
                  </MarkerContent>
                  <MarkerTooltip>{LOCATION.name}</MarkerTooltip>
                  <MarkerPopup closeButton>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-forest-900">
                        {LOCATION.name}
                      </p>
                      <p className="text-xs text-forest-500">
                        {LOCATION.address}
                      </p>
                      <p className="text-xs text-forest-500">
                        {LOCATION.city}
                      </p>
                      <a
                        href={SITE.address.mapHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-xs font-medium text-forest-700 underline-offset-2 hover:underline"
                      >
                        Open in Google Maps →
                      </a>
                    </div>
                  </MarkerPopup>
                </MapMarker>
                <MapControls showZoom showLocate />
              </Map>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

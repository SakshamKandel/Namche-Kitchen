"use client";

import MapLibreGL, { type PopupOptions, type MarkerOptions } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X, Minus, Plus, Locate, Maximize, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const defaultStyles = {
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
};

type Theme = "light" | "dark";

function getDocumentTheme(): Theme | null {
  if (typeof document === "undefined") return null;
  if (document.documentElement.classList.contains("dark")) return "dark";
  if (document.documentElement.classList.contains("light")) return "light";
  return null;
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function useResolvedTheme(themeProp?: "light" | "dark"): Theme {
  const [detectedTheme, setDetectedTheme] = useState<Theme>(
    () => getDocumentTheme() ?? getSystemTheme(),
  );

  useEffect(() => {
    if (themeProp) return;
    const observer = new MutationObserver(() => {
      const docTheme = getDocumentTheme();
      if (docTheme) setDetectedTheme(docTheme);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (!getDocumentTheme()) setDetectedTheme(e.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handleSystemChange);
    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, [themeProp]);

  return themeProp ?? detectedTheme;
}

/* ── Map Context ── */

type MapContextValue = { map: MapLibreGL.Map | null; isLoaded: boolean };

const MapContext = createContext<MapContextValue | null>(null);

export function useMap() {
  const context = useContext(MapContext);
  if (!context) throw new Error("useMap must be used within a Map component");
  return context;
}

export type MapViewport = {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
};

type MapStyleOption = string | MapLibreGL.StyleSpecification;

export type MapRef = MapLibreGL.Map;

type MapProps = {
  children?: ReactNode;
  className?: string;
  theme?: Theme;
  styles?: { light?: MapStyleOption; dark?: MapStyleOption };
  projection?: MapLibreGL.ProjectionSpecification;
  viewport?: Partial<MapViewport>;
  onViewportChange?: (viewport: MapViewport) => void;
  loading?: boolean;
} & Omit<MapLibreGL.MapOptions, "container" | "style">;

function DefaultLoader() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <div className="flex gap-1">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-forest-400/60" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-forest-400/60 [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-forest-400/60 [animation-delay:300ms]" />
      </div>
    </div>
  );
}

function getViewport(map: MapLibreGL.Map): MapViewport {
  const center = map.getCenter();
  return {
    center: [center.lng, center.lat],
    zoom: map.getZoom(),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
  };
}

export const Map = forwardRef<MapRef, MapProps>(function Map(
  {
    children,
    className,
    theme: themeProp,
    styles,
    projection,
    viewport,
    onViewportChange,
    loading = false,
    ...props
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<MapLibreGL.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const currentStyleRef = useRef<MapStyleOption | null>(null);
  const styleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const internalUpdateRef = useRef(false);
  const resolvedTheme = useResolvedTheme(themeProp);

  const isControlled =
    viewport !== undefined && onViewportChange !== undefined;

  const onViewportChangeRef = useRef(onViewportChange);
  onViewportChangeRef.current = onViewportChange;

  const mapStyles = useMemo(
    () => ({
      dark: styles?.dark ?? defaultStyles.dark,
      light: styles?.light ?? defaultStyles.light,
    }),
    [styles],
  );

  useImperativeHandle(ref, () => mapInstance as MapLibreGL.Map, [mapInstance]);

  const clearStyleTimeout = useCallback(() => {
    if (styleTimeoutRef.current) {
      clearTimeout(styleTimeoutRef.current);
      styleTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const initialStyle =
      resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light;
    currentStyleRef.current = initialStyle;

    const map = new MapLibreGL.Map({
      container: containerRef.current,
      style: initialStyle,
      renderWorldCopies: false,
      attributionControl: { compact: true },
      ...props,
      ...viewport,
    });

    const styleDataHandler = () => {
      clearStyleTimeout();
      styleTimeoutRef.current = setTimeout(() => {
        setIsStyleLoaded(true);
        if (projection) map.setProjection(projection);
      }, 100);
    };
    const loadHandler = () => setIsLoaded(true);

    const handleMove = () => {
      if (internalUpdateRef.current) return;
      onViewportChangeRef.current?.(getViewport(map));
    };

    map.on("load", loadHandler);
    map.on("styledata", styleDataHandler);
    map.on("move", handleMove);
    setMapInstance(map);

    return () => {
      clearStyleTimeout();
      map.off("load", loadHandler);
      map.off("styledata", styleDataHandler);
      map.off("move", handleMove);
      map.remove();
      setIsLoaded(false);
      setIsStyleLoaded(false);
      setMapInstance(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapInstance || !isControlled || !viewport) return;
    if (mapInstance.isMoving()) return;
    const current = getViewport(mapInstance);
    const next = {
      center: viewport.center ?? current.center,
      zoom: viewport.zoom ?? current.zoom,
      bearing: viewport.bearing ?? current.bearing,
      pitch: viewport.pitch ?? current.pitch,
    };
    if (
      next.center[0] === current.center[0] &&
      next.center[1] === current.center[1] &&
      next.zoom === current.zoom &&
      next.bearing === current.bearing &&
      next.pitch === current.pitch
    )
      return;
    internalUpdateRef.current = true;
    mapInstance.jumpTo(next);
    internalUpdateRef.current = false;
  }, [mapInstance, isControlled, viewport]);

  useEffect(() => {
    if (!mapInstance || !resolvedTheme) return;
    const newStyle =
      resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light;
    if (currentStyleRef.current === newStyle) return;
    clearStyleTimeout();
    currentStyleRef.current = newStyle;
    setIsStyleLoaded(false);
    mapInstance.setStyle(newStyle, { diff: true });
  }, [mapInstance, resolvedTheme, mapStyles, clearStyleTimeout]);

  const contextValue = useMemo(
    () => ({
      map: mapInstance,
      isLoaded: isLoaded && isStyleLoaded,
    }),
    [mapInstance, isLoaded, isStyleLoaded],
  );

  return (
    <MapContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={cn("relative h-full w-full", className)}
      >
        {(!isLoaded || loading) && <DefaultLoader />}
        {mapInstance && children}
      </div>
    </MapContext.Provider>
  );
});

/* ── Marker ── */

type MarkerContextValue = { marker: MapLibreGL.Marker; map: MapLibreGL.Map | null };

const MarkerContext = createContext<MarkerContextValue | null>(null);

function useMarkerContext() {
  const context = useContext(MarkerContext);
  if (!context) throw new Error("Marker components must be used within MapMarker");
  return context;
}

type MapMarkerProps = {
  longitude: number;
  latitude: number;
  children: ReactNode;
  onClick?: (e: MouseEvent) => void;
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
  onDragStart?: (lngLat: { lng: number; lat: number }) => void;
  onDrag?: (lngLat: { lng: number; lat: number }) => void;
  onDragEnd?: (lngLat: { lng: number; lat: number }) => void;
} & Omit<MarkerOptions, "element">;

export function MapMarker({
  longitude,
  latitude,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onDragStart,
  onDrag,
  onDragEnd,
  draggable = false,
  ...markerOptions
}: MapMarkerProps) {
  const { map } = useMap();
  const callbacksRef = useRef({
    onClick, onMouseEnter, onMouseLeave, onDragStart, onDrag, onDragEnd,
  });
  callbacksRef.current = { onClick, onMouseEnter, onMouseLeave, onDragStart, onDrag, onDragEnd };

  const marker = useMemo(() => {
    const m = new MapLibreGL.Marker({
      ...markerOptions,
      element: document.createElement("div"),
      draggable,
    }).setLngLat([longitude, latitude]);

    const el = m.getElement();
    const hc = (e: MouseEvent) => callbacksRef.current.onClick?.(e);
    const he = (e: MouseEvent) => callbacksRef.current.onMouseEnter?.(e);
    const hl = (e: MouseEvent) => callbacksRef.current.onMouseLeave?.(e);
    el?.addEventListener("click", hc);
    el?.addEventListener("mouseenter", he);
    el?.addEventListener("mouseleave", hl);

    m.on("dragstart", () => {
      const ll = m.getLngLat();
      callbacksRef.current.onDragStart?.({ lng: ll.lng, lat: ll.lat });
    });
    m.on("drag", () => {
      const ll = m.getLngLat();
      callbacksRef.current.onDrag?.({ lng: ll.lng, lat: ll.lat });
    });
    m.on("dragend", () => {
      const ll = m.getLngLat();
      callbacksRef.current.onDragEnd?.({ lng: ll.lng, lat: ll.lat });
    });
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!map) return;
    marker.addTo(map);
    return () => { marker.remove(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  const ll = marker.getLngLat();
  if (ll.lng !== longitude || ll.lat !== latitude) marker.setLngLat([longitude, latitude]);
  if (marker.isDraggable() !== draggable) marker.setDraggable(draggable);

  return (
    <MarkerContext.Provider value={{ marker, map }}>
      {children}
    </MarkerContext.Provider>
  );
}

type MarkerContentProps = {
  children?: ReactNode;
  className?: string;
};

export function MarkerContent({ children, className }: MarkerContentProps) {
  const { marker } = useMarkerContext();
  return createPortal(
    <div className={cn("relative cursor-pointer", className)}>
      {children || <DefaultMarkerIcon />}
    </div>,
    marker.getElement(),
  );
}

function DefaultMarkerIcon() {
  return (
    <div className="relative h-4 w-4 rounded-full border-2 border-white bg-forest-700 shadow-lg" />
  );
}

/* ── Popup / Tooltip ── */

function PopupCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close popup"
      className="absolute top-0.5 right-0.5 z-10 inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm text-forest-900 transition-colors hover:bg-cream-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-300"
    >
      <X className="h-3.5 w-3.5" />
    </button>
  );
}

type MarkerPopupProps = {
  children: ReactNode;
  className?: string;
  closeButton?: boolean;
} & Omit<PopupOptions, "className" | "closeButton">;

export function MarkerPopup({
  children,
  className,
  closeButton = false,
  ...popupOptions
}: MarkerPopupProps) {
  const { marker, map } = useMarkerContext();
  const container = useMemo(() => document.createElement("div"), []);
  const prevPopupOptions = useRef(popupOptions);

  const popup = useMemo(() => {
    const p = new MapLibreGL.Popup({
      offset: 16,
      ...popupOptions,
      closeButton: false,
    })
      .setMaxWidth("none")
      .setDOMContent(container);
    return p;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!map) return;
    popup.setDOMContent(container);
    marker.setPopup(popup);
    return () => { marker.setPopup(null); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  if (popup.isOpen()) {
    const prev = prevPopupOptions.current;
    if (prev.offset !== popupOptions.offset) popup.setOffset(popupOptions.offset ?? 16);
    if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth)
      popup.setMaxWidth(popupOptions.maxWidth ?? "none");
    prevPopupOptions.current = popupOptions;
  }

  return createPortal(
    <div className={cn("relative max-w-[15.5rem] rounded-md border border-cream-200 bg-white p-3 text-forest-900 shadow-md transition-all duration-200", className)}>
      {closeButton && <PopupCloseButton onClick={() => popup.remove()} />}
      {children}
    </div>,
    container,
  );
}

type MarkerTooltipProps = {
  children: ReactNode;
  className?: string;
} & Omit<PopupOptions, "className" | "closeButton" | "closeOnClick">;

export function MarkerTooltip({
  children,
  className,
  ...popupOptions
}: MarkerTooltipProps) {
  const { marker, map } = useMarkerContext();
  const container = useMemo(() => document.createElement("div"), []);
  const prevTooltipOptions = useRef(popupOptions);

  const tooltip = useMemo(() => {
    const t = new MapLibreGL.Popup({
      offset: 16,
      ...popupOptions,
      closeOnClick: true,
      closeButton: false,
    }).setMaxWidth("none");
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!map) return;
    tooltip.setDOMContent(container);
    const he = () => tooltip.setLngLat(marker.getLngLat()).addTo(map);
    const hl = () => tooltip.remove();
    marker.getElement()?.addEventListener("mouseenter", he);
    marker.getElement()?.addEventListener("mouseleave", hl);
    return () => {
      marker.getElement()?.removeEventListener("mouseenter", he);
      marker.getElement()?.removeEventListener("mouseleave", hl);
      tooltip.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  if (tooltip.isOpen()) {
    const prev = prevTooltipOptions.current;
    if (prev.offset !== popupOptions.offset) tooltip.setOffset(popupOptions.offset ?? 16);
    if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth)
      tooltip.setMaxWidth(popupOptions.maxWidth ?? "none");
    prevTooltipOptions.current = popupOptions;
  }

  return createPortal(
    <div className={cn("pointer-events-none rounded-md bg-forest-800 px-2 py-1 text-xs text-cream-50 shadow-md", className)}>
      {children}
    </div>,
    container,
  );
}

type MarkerLabelProps = {
  children: ReactNode;
  className?: string;
  position?: "top" | "bottom";
};

export function MarkerLabel({ children, className, position = "top" }: MarkerLabelProps) {
  const pos = position === "top" ? "bottom-full mb-1" : "top-full mt-1";
  return (
    <div className={cn("absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-forest-900", pos, className)}>
      {children}
    </div>
  );
}

/* ── Controls ── */

const positionClasses = {
  "top-left": "top-2 left-2",
  "top-right": "top-2 right-2",
  "bottom-left": "bottom-2 left-2",
  "bottom-right": "bottom-10 right-2",
};

function ControlGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-cream-200 bg-white shadow-sm [&>button:not(:last-child)]:border-b [&>button:not(:last-child)]:border-cream-200">
      {children}
    </div>
  );
}

function ControlButton({
  onClick,
  label,
  children,
  disabled = false,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      type="button"
      className={cn(
        "flex h-8 w-8 items-center justify-center transition-all first:rounded-t-md last:rounded-b-md",
        "hover:bg-forest-50 focus-visible:ring-2 focus-visible:ring-forest-300 focus-visible:outline-none focus-visible:ring-inset",
        "disabled:pointer-events-none disabled:opacity-50",
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function MapControls({
  position = "bottom-right",
  showZoom = true,
  showLocate = false,
  className,
  onLocate,
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showZoom?: boolean;
  showLocate?: boolean;
  className?: string;
  onLocate?: (coords: { longitude: number; latitude: number }) => void;
}) {
  const { map } = useMap();
  const [waiting, setWaiting] = useState(false);

  const zoomIn = useCallback(() => map?.zoomTo(map.getZoom() + 1, { duration: 300 }), [map]);
  const zoomOut = useCallback(() => map?.zoomTo(map.getZoom() - 1, { duration: 300 }), [map]);
  const locate = useCallback(() => {
    setWaiting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const c = { longitude: pos.coords.longitude, latitude: pos.coords.latitude };
          map?.flyTo({ center: [c.longitude, c.latitude], zoom: 14, duration: 1500 });
          onLocate?.(c);
          setWaiting(false);
        },
        () => setWaiting(false),
      );
    }
  }, [map, onLocate]);

  return (
    <div className={cn("absolute z-10 flex flex-col gap-1.5", positionClasses[position], className)}>
      {showZoom && (
        <ControlGroup>
          <ControlButton onClick={zoomIn} label="Zoom in"><Plus className="h-4 w-4" /></ControlButton>
          <ControlButton onClick={zoomOut} label="Zoom out"><Minus className="h-4 w-4" /></ControlButton>
        </ControlGroup>
      )}
      {showLocate && (
        <ControlGroup>
          <ControlButton onClick={locate} label="Find my location" disabled={waiting}>
            {waiting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Locate className="h-4 w-4" />}
          </ControlButton>
        </ControlGroup>
      )}
    </div>
  );
}

/* ── Route / Arc / Cluster exports (kept for API parity, minimal implementation) ── */

export type MapRouteProps = {
  id?: string;
  coordinates: [number, number][];
  color?: string;
  width?: number;
  opacity?: number;
};

export function MapRoute({
  id: propId,
  coordinates,
  color = "#4285F4",
  width = 3,
  opacity = 0.8,
}: MapRouteProps) {
  const { map, isLoaded } = useMap();
  const autoId = useId();
  const id = propId ?? autoId;
  const sourceId = `route-source-${id}`;
  const layerId = `route-layer-${id}`;

  useEffect(() => {
    if (!isLoaded || !map) return;
    map.addSource(sourceId, {
      type: "geojson",
      data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [] } },
    });
    map.addLayer({
      id: layerId,
      type: "line",
      source: sourceId,
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": color, "line-width": width, "line-opacity": opacity },
    });
    return () => {
      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch { /* ignore */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, map]);

  useEffect(() => {
    if (!isLoaded || !map || coordinates.length < 2) return;
    const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource | undefined;
    if (source) {
      source.setData({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates } });
    }
  }, [isLoaded, map, coordinates, sourceId]);

  return null;
}

// Minimal stubs for arc / cluster to preserve exported API
export type MapArcDatum = { id: string | number; from: [number, number]; to: [number, number] };
export type MapArcEvent<T extends MapArcDatum = MapArcDatum> = { arc: T; longitude: number; latitude: number; originalEvent: MapLibreGL.MapMouseEvent };

export function MapArc({ data }: { data: MapArcDatum[] }) {
  const { map, isLoaded } = useMap();
  useEffect(() => {
    if (!isLoaded || !map || !data.length) return;
    // Minimal implementation — full arc rendering omitted for brevity
  }, [isLoaded, map, data]);
  return null;
}

export function MapClusterLayer({ data }: { data: string | GeoJSON.FeatureCollection<GeoJSON.Point> }) {
  const { map, isLoaded } = useMap();
  useEffect(() => {
    if (!isLoaded || !map) return;
    // Minimal implementation — full cluster rendering omitted for brevity
  }, [isLoaded, map, data]);
  return null;
}

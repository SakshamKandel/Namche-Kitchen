"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, Check, Crop, RotateCcw, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ImageCropperProps {
  src: string;
  onCancel: () => void;
  onConfirm: (croppedBlob: Blob) => void;
}

/** How far past the cover-fit ("100%") the user may zoom in. */
const MAX_ZOOM = 4;
/** Exported square edge is clamped to this range (never upscales past source). */
const OUT_MAX = 1280;
const OUT_MIN = 320;
const JPEG_QUALITY = 0.9;

type Pt = { x: number; y: number };

export function ImageCropper({ src, onCancel, onConfirm }: ImageCropperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // The decoded source image, reused for both display and the final canvas draw.
  const imgElRef = useRef<HTMLImageElement | null>(null);
  // Live transform mirrors — read inside gesture handlers to avoid stale closures.
  const scaleRef = useRef(1);
  const posRef = useRef<Pt>({ x: 0, y: 0 });
  // Active pointers (id → frame-local coords) + the current gesture.
  const pointersRef = useRef<Map<number, Pt>>(new Map());
  const gestureRef = useRef({
    mode: "none" as "none" | "pan" | "pinch",
    panX: 0,
    panY: 0,
    pinchDist: 0,
    pinchScale: 1,
  });
  const resultRef = useRef<Blob | null>(null);

  const [frame, setFrame] = useState(0); // measured square side of the crop window (px)
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState<Pt>({ x: 0, y: 0 });
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [cropping, setCropping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);

  // Cover-fit is the minimum scale: at this scale the image exactly fills the
  // frame, so the user can never zoom out far enough to reveal gaps.
  const coverScale =
    frame > 0 && natural.w > 0 && natural.h > 0
      ? Math.max(frame / natural.w, frame / natural.h)
      : 1;
  const minScale = coverScale;
  const maxScale = coverScale * MAX_ZOOM;

  // Clamp a candidate position so the image always covers the frame.
  const clampPos = useCallback(
    (s: number, x: number, y: number): Pt => ({
      x: Math.min(0, Math.max(frame - natural.w * s, x)),
      y: Math.min(0, Math.max(frame - natural.h * s, y)),
    }),
    [frame, natural.w, natural.h]
  );

  // Commit a transform to both React state and the refs in one place.
  const commit = useCallback(
    (s: number, x: number, y: number) => {
      const p = clampPos(s, x, y);
      scaleRef.current = s;
      posRef.current = p;
      setScale(s);
      setPos(p);
    },
    [clampPos]
  );

  // Zoom toward a focal point (cursor, pinch midpoint, or frame center) so the
  // pixel under that point stays put.
  const zoomTo = useCallback(
    (rawScale: number, focalX: number, focalY: number) => {
      const next = Math.min(maxScale, Math.max(minScale, rawScale));
      const s0 = scaleRef.current;
      const p0 = posRef.current;
      const imgX = (focalX - p0.x) / s0;
      const imgY = (focalY - p0.y) / s0;
      commit(next, focalX - imgX * next, focalY - imgY * next);
    },
    [minScale, maxScale, commit]
  );

  const recenter = useCallback(() => {
    if (frame <= 0 || natural.w <= 0) return;
    const cover = Math.max(frame / natural.w, frame / natural.h);
    commit(cover, (frame - natural.w * cover) / 2, (frame - natural.h * cover) / 2);
  }, [frame, natural.w, natural.h, commit]);

  /* ── Load + decode the image once ────────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setError(null);
    const img = new window.Image();
    img.decoding = "async";
    const ready = () => {
      if (cancelled) return;
      if (!img.naturalWidth || !img.naturalHeight) {
        setStatus("error");
        return;
      }
      imgElRef.current = img;
      setNatural({ w: img.naturalWidth, h: img.naturalHeight });
      setStatus("ready");
    };
    img.onload = ready;
    img.onerror = () => !cancelled && setStatus("error");
    img.src = src;
    // Cover the cached/synchronous-decode case where onload may not fire.
    if (img.complete && img.naturalWidth) ready();
    return () => {
      cancelled = true;
    };
  }, [src]);

  /* ── Measure the (responsive) crop frame ─────────────────────── */
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setFrame(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── Fit (cover) the image whenever the image or frame changes ── */
  useEffect(() => {
    if (frame <= 0 || natural.w <= 0) return;
    recenter();
    // Only re-fit on genuine input changes (load / resize), not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame, natural.w, natural.h]);

  /* ── Wheel zoom (non-passive so preventDefault actually works) ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (status !== "ready") return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      zoomTo(scaleRef.current * factor, e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [status, zoomTo]);

  /* ── Escape closes ONLY the cropper (capture-phase, stop bubbling
        so the parent editor's Escape handler doesn't also fire) ──── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && visible) {
        e.preventDefault();
        e.stopPropagation();
        requestClose(null);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  /* ── Lock background scroll while open ───────────────────────── */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  /* ── Pointer gestures: 1 finger pans, 2 fingers pinch-zoom ───── */
  const frameCoords = (clientX: number, clientY: number): Pt => {
    const r = containerRef.current?.getBoundingClientRect();
    return { x: clientX - (r?.left ?? 0), y: clientY - (r?.top ?? 0) };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (status !== "ready" || cropping) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const fc = frameCoords(e.clientX, e.clientY);
    pointersRef.current.set(e.pointerId, fc);
    const g = gestureRef.current;
    if (pointersRef.current.size === 1) {
      g.mode = "pan";
      g.panX = fc.x - posRef.current.x;
      g.panY = fc.y - posRef.current.y;
    } else if (pointersRef.current.size === 2) {
      const [a, b] = [...pointersRef.current.values()];
      g.mode = "pinch";
      g.pinchDist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      g.pinchScale = scaleRef.current;
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    const fc = frameCoords(e.clientX, e.clientY);
    pointersRef.current.set(e.pointerId, fc);
    const g = gestureRef.current;
    if (g.mode === "pinch" && pointersRef.current.size >= 2) {
      const [a, b] = [...pointersRef.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      zoomTo(g.pinchScale * (dist / g.pinchDist), mid.x, mid.y);
    } else if (g.mode === "pan") {
      commit(scaleRef.current, fc.x - g.panX, fc.y - g.panY);
    }
  };

  const endPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(e.pointerId);
    const g = gestureRef.current;
    if (pointersRef.current.size === 1) {
      // Lifted one finger of a pinch — keep panning from the remaining one.
      const [only] = [...pointersRef.current.values()];
      g.mode = "pan";
      g.panX = only.x - posRef.current.x;
      g.panY = only.y - posRef.current.y;
    } else if (pointersRef.current.size === 0) {
      g.mode = "none";
    }
  };

  /* ── Close with an exit animation, then hand the result up ───── */
  function requestClose(blob: Blob | null) {
    resultRef.current = blob;
    setVisible(false);
  }

  function handleExitComplete() {
    if (resultRef.current) onConfirm(resultRef.current);
    else onCancel();
  }

  /* ── Render the crop to a square JPEG ────────────────────────── */
  async function performCrop() {
    const img = imgElRef.current;
    if (!img || status !== "ready" || frame <= 0) return;
    setCropping(true);
    setError(null);
    try {
      const s = scaleRef.current;
      const p = posRef.current;
      // Source rectangle (in natural pixels) currently framed.
      const srcX = -p.x / s;
      const srcY = -p.y / s;
      const srcSide = frame / s;
      // Export at source resolution, capped — avoids upscaling blur and huge files.
      const outSize = Math.round(Math.min(OUT_MAX, Math.max(OUT_MIN, srcSide)));

      const canvas = document.createElement("canvas");
      canvas.width = outSize;
      canvas.height = outSize;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, srcX, srcY, srcSide, srcSide, 0, 0, outSize, outSize);

      const blob = await new Promise<Blob | null>((res) =>
        canvas.toBlob(res, "image/jpeg", JPEG_QUALITY)
      );
      if (!blob) throw new Error("Could not encode the image");
      requestClose(blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cropping failed. Please try again.");
      setCropping(false);
    }
  }

  const zoomPct = Math.round((scale / coverScale) * 100);
  const atMin = scale <= minScale + 1e-3;
  const atMax = scale >= maxScale - 1e-3;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.18 } },
  };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 320, damping: 28 },
    },
    exit: { opacity: 0, scale: 0.96, y: 10, transition: { duration: 0.15 } },
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          key="cropper"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-forest-950/50 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && !cropping) requestClose(null);
          }}
        >
          <motion.div
            variants={modalVariants}
            role="dialog"
            aria-modal="true"
            aria-label="Crop photo"
            className="w-full max-w-md rounded-3xl border border-forest-100 bg-white p-6 shadow-lift"
          >
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crop className="h-4 w-4 text-forest-500" />
                <h3 className="font-display text-lg font-semibold text-forest-900">
                  Crop photo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => !cropping && requestClose(null)}
                aria-label="Close"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-forest-400 transition-colors hover:bg-forest-50 hover:text-forest-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Crop window */}
            <div className="mb-3 flex justify-center">
              <div
                ref={containerRef}
                className="relative aspect-square w-full max-w-[320px] touch-none select-none overflow-hidden rounded-2xl bg-forest-100 shadow-inner"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endPointer}
                onPointerCancel={endPointer}
              >
                {status === "ready" && imgElRef.current && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt=""
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    className="absolute block max-w-none"
                    style={{
                      left: pos.x,
                      top: pos.y,
                      width: natural.w * scale,
                      height: natural.h * scale,
                      cursor: gestureRef.current.mode === "pan" ? "grabbing" : "grab",
                    }}
                  />
                )}

                {status === "loading" && (
                  <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-forest-400">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-forest-300 border-t-forest-600" />
                    Loading…
                  </div>
                )}

                {status === "error" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center text-sm text-forest-500">
                    <ImageOff className="h-6 w-6 text-forest-400" />
                    Couldn&apos;t load this image.
                  </div>
                )}

                {/* Grid + frame guides (non-interactive) */}
                {status === "ready" && (
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/60" />
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute left-1/3 top-0 h-full w-px bg-white" />
                      <div className="absolute left-2/3 top-0 h-full w-px bg-white" />
                      <div className="absolute left-0 top-1/3 h-px w-full bg-white" />
                      <div className="absolute left-0 top-2/3 h-px w-full bg-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <p className="mb-4 text-center text-xs text-forest-400">
              Drag to reposition · scroll or pinch to zoom
            </p>

            {/* Zoom controls */}
            <div className="mb-5 flex items-center gap-3 px-1">
              <button
                type="button"
                onClick={() => zoomTo(scale * 0.85, frame / 2, frame / 2)}
                disabled={atMin || status !== "ready"}
                aria-label="Zoom out"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest-50 text-forest-600 transition-colors hover:bg-forest-100 disabled:opacity-40"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <input
                type="range"
                min={minScale}
                max={maxScale}
                step={(maxScale - minScale) / 100 || 0.01}
                value={scale}
                onChange={(e) => zoomTo(parseFloat(e.target.value), frame / 2, frame / 2)}
                disabled={status !== "ready"}
                aria-label="Zoom"
                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-forest-200 accent-forest-600 disabled:opacity-40"
              />
              <button
                type="button"
                onClick={() => zoomTo(scale * 1.15, frame / 2, frame / 2)}
                disabled={atMax || status !== "ready"}
                aria-label="Zoom in"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest-50 text-forest-600 transition-colors hover:bg-forest-100 disabled:opacity-40"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={recenter}
                disabled={status !== "ready"}
                aria-label="Reset"
                title="Reset"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest-50 text-forest-600 transition-colors hover:bg-forest-100 disabled:opacity-40"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <span className="w-10 shrink-0 text-right text-xs tabular-nums text-forest-400">
                {status === "ready" ? `${zoomPct}%` : "—"}
              </span>
            </div>

            {error && (
              <p className="mb-4 rounded-xl border border-spice-400/30 bg-spice-400/10 px-3 py-2 text-xs text-spice-600">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => requestClose(null)}
                disabled={cropping}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="forest"
                size="md"
                onClick={performCrop}
                disabled={status !== "ready" || cropping}
                className="flex-1"
              >
                {cropping ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream-50/40 border-t-cream-50" />
                    Cropping…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Crop &amp; save
                  </span>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Upload, X, ImageOff, Loader2, ClipboardPaste } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ImageCropper } from "./ImageCropper";

interface ImageUploaderProps {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  className?: string;
}

/** The cropped/encoded upload must stay under this (matches the API limit). */
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
/** Originals may be larger — they get cropped + re-encoded down before upload. */
const MAX_SOURCE_BYTES = 30 * 1024 * 1024;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
}

export function ImageUploader({ value, onChange, className }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [pasteFlash, setPasteFlash] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  async function uploadBlob(blob: Blob) {
    setError(null);
    if (blob.size > MAX_UPLOAD_BYTES) {
      setError("Cropped image is too large. Try zooming out or a smaller photo.");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", blob, "cropped.jpg");

      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json().catch(() => ({})) as { ok?: boolean; url?: string; error?: string };

      if (!res.ok || !data.ok || !data.url) {
        setError(data.error ?? "Upload failed. Please try again.");
        return;
      }

      onChange(data.url);
    } catch {
      setError("Network error — upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("That file isn’t an image. Please choose a PNG, JPG, or WebP.");
      return;
    }
    if (file.size > MAX_SOURCE_BYTES) {
      setError("Image is too large (max 30 MB). Please choose a smaller photo.");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setCropSrc(dataUrl);
    } catch {
      setError("Could not read that image. Please try another file.");
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
    else setError("Please drop an image file.");
  }

  /* ── Clipboard paste handler ───────────────────────────────── */
  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    if (!e.clipboardData) return;

    const items = e.clipboardData.items;
    let imageFile: File | null = null;

    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          imageFile = file;
          break;
        }
      }
    }

    if (imageFile) {
      e.preventDefault();
      setPasteFlash(true);
      setTimeout(() => setPasteFlash(false), 400);
      await handleFile(imageFile);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Cropper modal */}
      {cropSrc && (
        <ImageCropper
          src={cropSrc}
          onCancel={() => setCropSrc(null)}
          onConfirm={(blob) => {
            setCropSrc(null);
            uploadBlob(blob);
          }}
        />
      )}

      {/* Paste hint badge */}
      {!value && !uploading && (
        <div className="flex items-center justify-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-[10px] font-medium text-forest-500">
          <ClipboardPaste className="h-3 w-3" />
          Press Ctrl+V to paste from clipboard
        </div>
      )}

      {/* Preview / drop-zone */}
      {value ? (
        <div className="group relative overflow-hidden rounded-2xl border border-forest-200 bg-forest-50">
          <div className="relative aspect-square w-full">
            <Image
              src={value}
              alt="Dish photo"
              fill
              sizes="400px"
              className="object-cover"
            />
          </div>
          {/* Overlay actions — always visible on touch, reveal on hover/focus on
              pointer devices (phones have no hover, so the buttons must show). */}
          <div className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-forest-900/60 to-transparent p-3 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-full bg-cream-50/90 px-3 py-1.5 text-xs font-semibold text-forest-800 transition hover:bg-cream-50 disabled:opacity-50"
            >
              <Upload className="h-3.5 w-3.5" />
              Replace
            </button>
            <button
              type="button"
              onClick={() => { onChange(null); setError(null); }}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-full bg-spice-500/90 px-3 py-1.5 text-xs font-semibold text-cream-50 transition hover:bg-spice-600 disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-forest-900/40 backdrop-blur-[2px]">
              <Loader2 className="h-8 w-8 animate-spin text-cream-50" />
            </div>
          )}
        </div>
      ) : (
        <div
          ref={dropZoneRef}
          role="button"
          tabIndex={0}
          aria-label="Click, drop, or paste an image to upload"
          onClick={() => !uploading && inputRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-all duration-200",
            pasteFlash && "scale-[1.02] border-forest-400 bg-forest-50",
            dragOver
              ? "border-forest-500 bg-forest-50"
              : "border-forest-200 bg-cream-50/60 hover:border-forest-400 hover:bg-forest-50/40",
            uploading && "pointer-events-none opacity-60"
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-forest-500" />
              <p className="text-sm font-medium text-forest-600">Uploading…</p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-100 text-forest-500 transition-transform duration-200">
                {dragOver || pasteFlash ? (
                  <Upload className="h-6 w-6" />
                ) : (
                  <ImageOff className="h-6 w-6" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-forest-700">
                  {dragOver ? "Drop to upload" : pasteFlash ? "Pasting…" : "Click, drop, or Ctrl+V"}
                </p>
                <p className="mt-0.5 text-xs text-forest-500">
                  PNG, JPG, WebP · max 8 MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={onInputChange}
        aria-hidden="true"
      />

      {/* Non-preview upload button (when no current image) */}
      {!value && !uploading && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          className="w-full"
        >
          <Upload className="h-4 w-4" />
          Choose photo
        </Button>
      )}

      {/* Inline error */}
      {error && (
        <p className="rounded-xl border border-spice-400/30 bg-spice-400/10 px-3 py-2 text-xs text-spice-600">
          {error}
        </p>
      )}
    </div>
  );
}

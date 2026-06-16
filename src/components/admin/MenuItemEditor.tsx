"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X, Loader2, AlertCircle, CheckCircle2, Flame } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { cn } from "@/lib/utils";
import type { AdminCategory, AdminMenuItem } from "@/components/admin/MenuManager";

interface MenuItemEditorProps {
  /** When null, we're in create mode. */
  item: AdminMenuItem | null;
  /** Pre-select this category on create. */
  defaultCategoryId?: string;
  categories: AdminCategory[];
  onClose: () => void;
  onSaved: () => void;
}

const inputBase =
  "w-full rounded-xl border border-forest-200 bg-cream-50/60 px-4 py-3 text-sm text-forest-900 placeholder:text-forest-400/60 outline-none transition-all duration-200 focus:border-forest-400 focus:ring-2 focus:ring-forest-400/25 disabled:opacity-50";

const labelBase = "text-xs font-semibold uppercase tracking-wide text-forest-700";

export function MenuItemEditor({
  item,
  defaultCategoryId,
  categories,
  onClose,
  onSaved,
}: MenuItemEditorProps) {
  const isEdit = item !== null;
  const headingId = useId();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Form state
  const [name, setName] = useState(item?.name ?? "");
  const [categoryId, setCategoryId] = useState(
    item?.categoryId ?? defaultCategoryId ?? categories[0]?.id ?? ""
  );
  const [description, setDescription] = useState(item?.description ?? "");
  // Price mode: "numeric" or "label"
  const [priceMode, setPriceMode] = useState<"numeric" | "label">(
    item?.priceLabel && item.price == null ? "label" : "numeric"
  );
  const [numericPrice, setNumericPrice] = useState(
    item?.price != null ? String(item.price) : ""
  );
  const [priceLabel, setPriceLabel] = useState(item?.priceLabel ?? "");
  const [options, setOptions] = useState(item?.options ?? "");
  const [tags, setTags] = useState(item?.tags ?? "");
  const [spiceLevel, setSpiceLevel] = useState(item?.spiceLevel ?? 0);
  const [featured, setFeatured] = useState(item?.featured ?? false);
  const [available, setAvailable] = useState(item?.available ?? true);
  const [imageUrl, setImageUrl] = useState<string | null>(item?.imageUrl ?? null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Trap focus & close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required."); return; }
    if (!categoryId) { setError("Please select a category."); return; }

    const parsedPrice = priceMode === "numeric" && numericPrice.trim()
      ? parseFloat(numericPrice)
      : null;

    if (priceMode === "numeric" && numericPrice.trim() && isNaN(parsedPrice!)) {
      setError("Price must be a valid number, e.g. 13.99");
      return;
    }

    const body = {
      name: name.trim(),
      categoryId,
      description: description.trim() || null,
      price: parsedPrice,
      priceLabel: priceMode === "label" && priceLabel.trim() ? priceLabel.trim() : null,
      imageUrl: imageUrl || null,
      options: options.trim() || null,
      tags: tags.trim() || null,
      spiceLevel,
      featured,
      available,
    };

    setError(null);
    setSaving(true);

    try {
      const url = isEdit ? `/api/menu/${item.id}` : "/api/menu";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string; issues?: unknown[] };
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      setSuccess(true);
      setTimeout(() => {
        onSaved();
        onClose();
      }, 600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    /* Backdrop */
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      aria-modal="true"
      role="dialog"
      aria-labelledby={headingId}
    >
      {/* Scrim */}
      <div className="absolute inset-0 bg-forest-950/40 backdrop-blur-[3px]" />

      {/* Panel */}
      <div className="relative z-10 flex max-h-[96dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-cream-50 shadow-lift sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-forest-100 bg-cream-100/70 px-6 py-4">
          <h2
            id={headingId}
            className="font-display text-xl font-semibold text-forest-900"
          >
            {isEdit ? `Edit — ${item.name}` : "Add Menu Item"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-forest-500 transition hover:bg-forest-100 hover:text-forest-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <form
            id="menu-item-form"
            onSubmit={handleSubmit}
            noValidate
            className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2"
          >
            {/* Photo — full width */}
            <div className="sm:col-span-2 flex flex-col gap-2">
              <label className={labelBase}>Photo</label>
              <ImageUploader
                value={imageUrl}
                onChange={setImageUrl}
              />
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="ei-name" className={labelBase}>
                Name <span className="text-forest-400">*</span>
              </label>
              <input
                id="ei-name"
                type="text"
                required
                placeholder="e.g. Chicken Momo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={saving}
                className={inputBase}
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ei-cat" className={labelBase}>
                Category <span className="text-forest-400">*</span>
              </label>
              <select
                id="ei-cat"
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={saving}
                className={cn(inputBase, "appearance-none")}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ei-opts" className={labelBase}>Options / choices</label>
              <input
                id="ei-opts"
                type="text"
                placeholder="e.g. Chicken / Veg"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
                disabled={saving}
                className={inputBase}
              />
            </div>

            {/* Description — full width */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="ei-desc" className={labelBase}>Description</label>
              <textarea
                id="ei-desc"
                rows={3}
                placeholder="Short description of the dish…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={saving}
                className={cn(inputBase, "resize-none")}
              />
            </div>

            {/* Price — toggle mode */}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <div className={cn(labelBase, "flex items-center justify-between")}>
                <span>Pricing</span>
                <span className="flex gap-3 font-normal normal-case tracking-normal text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer text-forest-600">
                    <input
                      type="radio"
                      name="price-mode"
                      value="numeric"
                      checked={priceMode === "numeric"}
                      onChange={() => setPriceMode("numeric")}
                      disabled={saving}
                      className="accent-forest-700"
                    />
                    Numeric
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-forest-600">
                    <input
                      type="radio"
                      name="price-mode"
                      value="label"
                      checked={priceMode === "label"}
                      onChange={() => setPriceMode("label")}
                      disabled={saving}
                      className="accent-forest-700"
                    />
                    Free-form label
                  </label>
                </span>
              </div>

              {priceMode === "numeric" ? (
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-forest-500">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={numericPrice}
                    onChange={(e) => setNumericPrice(e.target.value)}
                    disabled={saving}
                    className={cn(inputBase, "pl-8")}
                  />
                  <p className="mt-1 text-[0.7rem] text-forest-500">
                    Leave blank if price varies.
                  </p>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder='e.g. "Small $11 / Large $15"'
                    value={priceLabel}
                    onChange={(e) => setPriceLabel(e.target.value)}
                    disabled={saving}
                    className={inputBase}
                  />
                  <p className="mt-1 text-[0.7rem] text-forest-500">
                    Free-form text shown exactly as typed — e.g. &quot;Small $11 / Large $15&quot;.
                  </p>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="ei-tags" className={labelBase}>Tags</label>
              <input
                id="ei-tags"
                type="text"
                placeholder="halal, vegetarian, spicy, popular, …"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                disabled={saving}
                className={inputBase}
              />
              <p className="text-[0.7rem] text-forest-500">
                Comma-separated. Known tags: <span className="font-medium">halal, vegetarian, vegan, spicy, popular, new</span>.
              </p>
            </div>

            {/* Spice level */}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className={labelBase}>Spice level</label>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSpiceLevel(lvl)}
                    disabled={saving}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-all ${
                      spiceLevel === lvl
                        ? "border-forest-400 bg-forest-50 text-forest-800 ring-1 ring-forest-400/30"
                        : "border-forest-200 text-forest-400 hover:border-forest-300 hover:bg-forest-50/50"
                    }`}
                    title={lvl === 0 ? "Not spicy" : `Spice level ${lvl}`}
                  >
                    {lvl === 0 ? (
                      <span className="text-xs">0</span>
                    ) : (
                      <Flame className="h-4 w-4" />
                    )}
                  </button>
                ))}
                <span className="ml-2 text-xs text-forest-500">
                  {spiceLevel === 0
                    ? "Not spicy"
                    : spiceLevel === 1
                      ? "Mild"
                      : spiceLevel === 2
                        ? "Medium"
                        : "Hot"}
                </span>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-6 sm:col-span-2">
              <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-forest-800 select-none">
                <input
                  type="checkbox"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                  disabled={saving}
                  className="h-4 w-4 rounded accent-forest-700"
                />
                Available
              </label>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-forest-800 select-none">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  disabled={saving}
                  className="h-4 w-4 rounded accent-gold-500"
                />
                Featured
              </label>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-forest-300/30 bg-forest-100/50 px-4 py-3 text-sm text-forest-600 sm:col-span-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Success flash */}
            {success && (
              <div className="flex items-center gap-2.5 rounded-xl border border-forest-200 bg-forest-50 px-4 py-3 text-sm text-forest-700 sm:col-span-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-forest-500" />
                <p>Saved!</p>
              </div>
            )}
          </form>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 border-t border-forest-100 bg-cream-100/50 px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="menu-item-form"
            variant="forest"
            size="sm"
            disabled={saving || success}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : isEdit ? (
              "Save changes"
            ) : (
              "Add item"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

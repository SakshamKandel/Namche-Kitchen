"use client";

import { useCallback, useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Star,
  StarOff,
  AlertCircle,
  Loader2,
  X,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TagBadges } from "@/components/ui/TagBadges";
import { MenuItemEditor } from "@/components/admin/MenuItemEditor";
import { displayPrice, cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────────────────────── */

export type AdminMenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  priceLabel: string | null;
  imageUrl: string | null;
  options: string | null;
  tags: string | null;
  spiceLevel: number;
  featured: boolean;
  available: boolean;
  sortOrder: number;
  categoryId: string;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  sortOrder: number;
  items: AdminMenuItem[];
};

/* ─── Small reusable primitives ─────────────────────────────────────────── */

const inputBase =
  "w-full rounded-xl border border-forest-200 bg-cream-50/60 px-4 py-2.5 text-sm text-forest-900 placeholder:text-forest-400/60 outline-none transition-all duration-200 focus:border-forest-400 focus:ring-2 focus:ring-forest-400/25 disabled:opacity-50";

const labelSm = "text-[0.7rem] font-semibold uppercase tracking-wide text-forest-600";

/* ─── Confirm dialog ─────────────────────────────────────────────────────── */

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
  busy,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-forest-950/40 backdrop-blur-[2px]" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-cream-200 bg-cream-50 p-6 shadow-subtle">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-forest-100">
          <AlertCircle className="h-5 w-5 text-forest-600" />
        </div>
        <p className="mb-6 text-sm leading-relaxed text-forest-800">{message}</p>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="forest"
            size="sm"
            onClick={onConfirm}
            disabled={busy}
            className="bg-forest-700 hover:bg-forest-800"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Category editor (inline modal) ────────────────────────────────────── */

function CategoryEditor({
  category,
  onClose,
  onSaved,
}: {
  category: AdminCategory | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = category !== null;
  const headingId = useId();
  const [name, setName] = useState(category?.name ?? "");
  const [tagline, setTagline] = useState(category?.tagline ?? "");
  const [sortOrder, setSortOrder] = useState(
    category?.sortOrder != null ? String(category.sortOrder) : "0"
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required."); return; }
    setError(null);
    setSaving(true);
    try {
      const url = isEdit ? `/api/categories/${category.id}` : "/api/categories";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          tagline: tagline.trim() || null,
          sortOrder: parseInt(sortOrder) || 0,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(d.error ?? `Failed (${res.status})`);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-forest-950/40 backdrop-blur-[2px]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="relative z-10 w-full max-w-md rounded-2xl border border-cream-200 bg-cream-50 shadow-subtle"
      >
        <div className="flex items-center justify-between border-b border-forest-100 bg-cream-100/70 px-6 py-4">
          <h2 id={headingId} className="font-display text-xl font-semibold text-forest-900">
            {isEdit ? "Edit category" : "Add category"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-forest-500 hover:bg-forest-100 hover:text-forest-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-1.5">
            <label className={labelSm}>Name <span className="text-spice-500">*</span></label>
            <input
              type="text"
              required
              placeholder="e.g. Momo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
              className={inputBase}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelSm}>Tagline</label>
            <input
              type="text"
              placeholder="e.g. Steamed & fried dumplings"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              disabled={saving}
              className={inputBase}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelSm}>Sort order</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              disabled={saving}
              className={inputBase}
            />
            <p className="text-[0.7rem] text-forest-500">Lower number appears first.</p>
          </div>
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-forest-300/30 bg-forest-100/50 px-4 py-3 text-sm text-forest-600">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="forest" size="sm" disabled={saving}>
              {saving ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
              ) : isEdit ? (
                "Save changes"
              ) : (
                "Add category"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function MenuManager({ initialCategories }: { initialCategories: AdminCategory[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const refresh = useCallback(() => {
    startTransition(() => { router.refresh(); });
  }, [router]);

  /* Dialogs / modals */
  const [categoryEditor, setCategoryEditor] = useState<{
    open: boolean;
    category: AdminCategory | null;
  }>({ open: false, category: null });

  const [itemEditor, setItemEditor] = useState<{
    open: boolean;
    item: AdminMenuItem | null;
    defaultCategoryId?: string;
  }>({ open: false, item: null });

  /* Confirm deletion */
  const [confirm, setConfirm] = useState<{
    message: string;
    onConfirm: () => Promise<void>;
  } | null>(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

  /* Expanded categories */
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const toggleCollapse = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  /* Per-item busy/error state for toggles */
  const [itemBusy, setItemBusy] = useState<Record<string, boolean>>({});
  const [itemError, setItemError] = useState<Record<string, string>>({});

  /* Per-category delete busy */
  const [catDeleteBusy, setCatDeleteBusy] = useState<Record<string, boolean>>({});

  /* Toast-style inline notification */
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  /* ── Helpers ──────────────────────────────────────────────────────────── */

  async function patchItem(id: string, patch: Partial<AdminMenuItem>) {
    setItemBusy((b) => ({ ...b, [id]: true }));
    setItemError((e) => ({ ...e, [id]: "" }));
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({})) as { error?: string };
        setItemError((e) => ({ ...e, [id]: d.error ?? "Update failed." }));
        return;
      }
      refresh();
    } catch {
      setItemError((e) => ({ ...e, [id]: "Network error." }));
    } finally {
      setItemBusy((b) => ({ ...b, [id]: false }));
    }
  }

  async function deleteItem(id: string) {
    const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json().catch(() => ({})) as { error?: string };
      throw new Error(d.error ?? "Delete failed.");
    }
    showToast("Item deleted.");
    refresh();
  }

  async function deleteCategory(id: string) {
    setCatDeleteBusy((b) => ({ ...b, [id]: true }));
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(d.error ?? "Delete failed.");
      }
      showToast("Category deleted.");
      refresh();
    } finally {
      setCatDeleteBusy((b) => ({ ...b, [id]: false }));
    }
  }

  function confirmDelete(message: string, action: () => Promise<void>) {
    setConfirm({ message, onConfirm: action });
  }

  /* ── Render ──────────────────────────────────────────────────────────── */

  return (
    <>
      {/* ── Page wrapper ─────────────────────────────────────────────── */}
      {/* Note: outer padding comes from AdminShell's <main>. */}
      <div className="flex flex-col gap-8">

        {/* ── Page header ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-forest-900">Menu</h1>
            <p className="mt-1 text-sm text-forest-600/80">
              Manage categories, dishes, pricing and photos.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCategoryEditor({ open: true, category: null })}
            >
              <Plus className="h-4 w-4" />
              Add category
            </Button>
            <Button
              variant="forest"
              size="sm"
              onClick={() => setItemEditor({ open: true, item: null, defaultCategoryId: initialCategories[0]?.id })}
            >
              <Plus className="h-4 w-4" />
              Add item
            </Button>
          </div>
        </div>

        {/* ── Empty state ──────────────────────────────────────────── */}
        {initialCategories.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-cream-300 bg-cream-50 py-16 text-center">
            <p className="font-display text-xl text-forest-700">No categories yet.</p>
            <p className="text-sm text-forest-500">Start by adding a category, then add dishes to it.</p>
            <Button
              variant="forest"
              size="sm"
              onClick={() => setCategoryEditor({ open: true, category: null })}
            >
              <Plus className="h-4 w-4" />
              Add your first category
            </Button>
          </div>
        )}

        {/* ── Category cards ───────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {initialCategories.map((cat) => {
            const isCollapsed = collapsed.has(cat.id);

            return (
              <section
                key={cat.id}
                className="overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-subtle"
              >
                {/* Category header */}
                <div className="flex flex-col gap-1 border-b border-forest-100 bg-cream-100/60 px-5 py-4 sm:flex-row sm:items-center sm:gap-3">
                  {/* Collapse toggle */}
                  <button
                    type="button"
                    onClick={() => toggleCollapse(cat.id)}
                    aria-label={isCollapsed ? "Expand category" : "Collapse category"}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-forest-500 hover:bg-forest-100 transition"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h2 className="font-display text-lg font-semibold leading-tight text-forest-900">
                      {cat.name}
                      <span className="ml-2 rounded-full bg-forest-100 px-2 py-0.5 text-[0.7rem] font-normal text-forest-600">
                        {cat.items.length}
                      </span>
                    </h2>
                    {cat.tagline && (
                      <p className="text-xs text-forest-600/75">{cat.tagline}</p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCategoryEditor({ open: true, category: cat })}
                      aria-label="Edit category"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-forest-500 hover:bg-forest-100 hover:text-forest-800 transition"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={catDeleteBusy[cat.id]}
                      onClick={() =>
                        confirmDelete(
                          `Delete the "${cat.name}" category? This will also permanently remove all ${cat.items.length} item(s) in it.`,
                          () => deleteCategory(cat.id)
                        )
                      }
                      aria-label="Delete category"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-forest-500 hover:bg-forest-50 hover:text-forest-700 transition disabled:opacity-40"
                    >
                      {catDeleteBusy[cat.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setItemEditor({ open: true, item: null, defaultCategoryId: cat.id })
                      }
                      className="hidden sm:inline-flex"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add item
                    </Button>
                  </div>
                </div>

                {/* Items list */}
                {!isCollapsed && (
                  <div className="divide-y divide-forest-100/60">
                    {cat.items.length === 0 && (
                      <div className="flex items-center gap-3 px-5 py-6 text-sm text-forest-500">
                        <p>No items in this category yet.</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setItemEditor({ open: true, item: null, defaultCategoryId: cat.id })
                          }
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add first item
                        </Button>
                      </div>
                    )}

                    {cat.items.map((item) => {
                      const busy = !!itemBusy[item.id];
                      const err = itemError[item.id];

                      return (
                        <div key={item.id} className="flex flex-col">
                          <div className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5">
                            {/* Thumbnail */}
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-forest-800">
                              {item.imageUrl ? (
                                <Image
                                  src={item.imageUrl}
                                  alt={item.name}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-forest-800 opacity-50" />
                              )}
                            </div>

                            {/* Name + meta */}
                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                <span className="truncate font-medium text-forest-900">
                                  {item.name}
                                </span>
                                {(() => {
                                  const p = displayPrice(item);
                                  return p ? (
                                    <span className="shrink-0 rounded-full bg-forest-50 px-2 py-0.5 text-xs font-semibold text-forest-700">
                                      {p}
                                    </span>
                                  ) : null;
                                })()}
                              </div>
                              <TagBadges tags={item.tags} />
                            </div>

                            {/* Controls */}
                            <div className="flex shrink-0 items-center gap-1">
                              {/* Available toggle */}
                              <button
                                type="button"
                                onClick={() => patchItem(item.id, { available: !item.available })}
                                disabled={busy}
                                title={item.available ? "Mark as unavailable" : "Mark as available"}
                                aria-label={item.available ? "Disable item" : "Enable item"}
                                className={cn(
                                  "flex h-8 w-8 items-center justify-center rounded-full transition disabled:opacity-40",
                                  item.available
                                    ? "text-forest-500 hover:bg-forest-100"
                                    : "text-forest-300 hover:bg-forest-50"
                                )}
                              >
                                {busy ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : item.available ? (
                                  <ToggleRight className="h-5 w-5 text-forest-600" />
                                ) : (
                                  <ToggleLeft className="h-5 w-5 text-forest-300" />
                                )}
                              </button>

                              {/* Featured toggle */}
                              <button
                                type="button"
                                onClick={() => patchItem(item.id, { featured: !item.featured })}
                                disabled={busy}
                                title={item.featured ? "Remove from featured" : "Mark as featured"}
                                aria-label={item.featured ? "Unfeature item" : "Feature item"}
                                className={cn(
                                  "flex h-8 w-8 items-center justify-center rounded-full transition disabled:opacity-40",
                                  item.featured
                                    ? "text-gold-500 hover:bg-gold-50"
                                    : "text-forest-300 hover:bg-forest-50"
                                )}
                              >
                                {item.featured ? (
                                  <Star className="h-4 w-4 fill-gold-400" />
                                ) : (
                                  <StarOff className="h-4 w-4" />
                                )}
                              </button>

                              {/* Edit */}
                              <button
                                type="button"
                                onClick={() => setItemEditor({ open: true, item })}
                                aria-label="Edit item"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-forest-500 hover:bg-forest-100 hover:text-forest-800 transition"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() =>
                                  confirmDelete(
                                    `Permanently delete "${item.name}"? This cannot be undone.`,
                                    () => deleteItem(item.id)
                                  )
                                }
                                aria-label="Delete item"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-forest-400 hover:bg-forest-50 hover:text-forest-700 transition"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Inline toggle error */}
                          {err && (
                            <p className="px-5 pb-2 text-xs text-forest-600">{err}</p>
                          )}
                        </div>
                      );
                    })}

                    {/* Mobile "Add item" footer */}
                    <div className="flex justify-start px-4 py-3 sm:hidden">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setItemEditor({ open: true, item: null, defaultCategoryId: cat.id })
                        }
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add item to {cat.name}
                      </Button>
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      {/* ── Toast notification ──────────────────────────────────────── */}
      {toast && (
        <div
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-forest-700 bg-forest-800 px-5 py-3 text-sm font-medium text-cream-50 shadow-subtle"
        >
          <CheckCircle2 className="h-4 w-4 text-forest-300" />
          {toast}
        </div>
      )}

      {/* ── Category editor modal ────────────────────────────────────── */}
      {categoryEditor.open && (
        <CategoryEditor
          category={categoryEditor.category}
          onClose={() => setCategoryEditor({ open: false, category: null })}
          onSaved={refresh}
        />
      )}

      {/* ── Item editor modal ────────────────────────────────────────── */}
      {itemEditor.open && (
        <MenuItemEditor
          item={itemEditor.item}
          defaultCategoryId={itemEditor.defaultCategoryId}
          categories={initialCategories}
          onClose={() => setItemEditor({ open: false, item: null })}
          onSaved={refresh}
        />
      )}

      {/* ── Confirm dialog ───────────────────────────────────────────── */}
      {confirm && (
        <ConfirmDialog
          message={confirm.message}
          busy={confirmBusy}
          onCancel={() => setConfirm(null)}
          onConfirm={async () => {
            setConfirmBusy(true);
            try {
              await confirm.onConfirm();
            } finally {
              setConfirmBusy(false);
              setConfirm(null);
            }
          }}
        />
      )}
    </>
  );
}

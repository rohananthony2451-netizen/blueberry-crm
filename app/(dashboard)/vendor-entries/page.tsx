"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { PageContainer } from "@/components/design-system/PageContainer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEvents } from "@/features/events/hooks/useEvents";
import { useVendors } from "@/features/vendors/hooks/useVendors";
import { VENDOR_CATEGORIES } from "@/features/vendors/types";
import { useVendorEntries } from "@/features/vendor-entries/hooks/useVendorEntries";
import {
  VENDOR_ENTRY_STATUSES,
  type VendorEntry,
  type VendorEntryFormValues,
  type VendorEntryStatus,
} from "@/features/vendor-entries/types";

const fieldClass =
  "mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

const entryCategories = [
  ...new Set([
    ...VENDOR_CATEGORIES,
    "Audio/Visual",
    "Lighting",
    "Transportation",
  ]),
];

function localToday() {
  const date = new Date();
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  if (!value) return "—";
  return new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString(
    "en-IN",
    { day: "2-digit", month: "short", year: "numeric" }
  );
}

function statusClass(status: VendorEntryStatus) {
  switch (status) {
    case "Confirmed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "Paid":
      return "border-green-200 bg-green-50 text-green-700";
    case "Pending":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "Cancelled":
      return "border-slate-200 bg-slate-100 text-slate-600";
  }
}

const emptyForm = (): VendorEntryFormValues => ({
  eventId: "",
  vendorId: "",
  category: "Other",
  amount: 0,
  entryDate: localToday(),
  status: "Confirmed",
  notes: "",
});

function VendorEntryForm({
  entry,
  saving,
  onCancel,
  onSave,
}: {
  entry: VendorEntry | null;
  saving: boolean;
  onCancel: () => void;
  onSave: (values: VendorEntryFormValues) => Promise<void>;
}) {
  const { events, loading: eventsLoading } = useEvents();
  const { vendors, loading: vendorsLoading } = useVendors();
  const [values, setValues] = useState<VendorEntryFormValues>(() =>
    entry
      ? {
          eventId: entry.eventId,
          vendorId: entry.vendorId,
          category: entry.category,
          amount: entry.amount,
          entryDate: entry.entryDate,
          status: entry.status,
          notes: entry.notes,
        }
      : emptyForm()
  );
  const [formError, setFormError] = useState("");

  function update<K extends keyof VendorEntryFormValues>(
    key: K,
    value: VendorEntryFormValues[K]
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (!values.eventId) {
      setFormError("Select an event.");
      return;
    }
    if (!values.vendorId) {
      setFormError("Select a vendor.");
      return;
    }
    if (!values.category.trim()) {
      setFormError("Select a category.");
      return;
    }
    if (!Number.isFinite(Number(values.amount)) || Number(values.amount) < 0) {
      setFormError("Enter a valid non-negative amount.");
      return;
    }
    if (!values.entryDate) {
      setFormError("Select a date.");
      return;
    }

    try {
      await onSave({ ...values, amount: Number(values.amount) });
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Could not save entry."
      );
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {(eventsLoading || vendorsLoading) && (
        <p className="text-sm text-slate-500">Loading events and vendors…</p>
      )}

      {!eventsLoading && events.length === 0 && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Create an event before adding a vendor entry.
        </p>
      )}

      {!vendorsLoading && vendors.length === 0 && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Add a vendor to your directory before creating an entry.
        </p>
      )}

      <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-600">
          Event *
          <select
            className={fieldClass}
            value={values.eventId}
            onChange={(e) => update("eventId", e.target.value)}
            required
          >
            <option value="">Select event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.eventName}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-medium uppercase tracking-wide text-slate-600">
          Vendor *
          <select
            className={fieldClass}
            value={values.vendorId}
            onChange={(e) => {
              const vendorId = e.target.value;
              update("vendorId", vendorId);
              const vendor = vendors.find((item) => item.id === vendorId);
              if (vendor) update("category", vendor.category);
            }}
            required
          >
            <option value="">Select vendor</option>
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-medium uppercase tracking-wide text-slate-600">
          Category *
          <select
            className={fieldClass}
            value={values.category}
            onChange={(e) => update("category", e.target.value)}
            required
          >
            {entryCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-medium uppercase tracking-wide text-slate-600">
          Amount (₹) *
          <input
            className={fieldClass}
            type="number"
            min="0"
            step="0.01"
            value={values.amount}
            onChange={(e) =>
              update(
                "amount",
                e.target.value === "" ? ("" as unknown as number) : Number(e.target.value)
              )
            }
            required
          />
        </label>

        <label className="text-xs font-medium uppercase tracking-wide text-slate-600">
          Date *
          <input
            className={fieldClass}
            type="date"
            value={values.entryDate}
            onChange={(e) => update("entryDate", e.target.value)}
            required
          />
        </label>

        <label className="text-xs font-medium uppercase tracking-wide text-slate-600">
          Status *
          <select
            className={fieldClass}
            value={values.status}
            onChange={(e) =>
              update("status", e.target.value as VendorEntryStatus)
            }
            required
          >
            {VENDOR_ENTRY_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-medium uppercase tracking-wide text-slate-600 sm:col-span-2">
          Notes
          <textarea
            className="mt-1.5 min-h-16 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            value={values.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Additional notes…"
            rows={2}
          />
        </label>
      </div>

      {formError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      )}

      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving || eventsLoading || vendorsLoading || events.length === 0 || vendors.length === 0}>
          {saving ? "Saving…" : entry ? "Save Changes" : "Save Entry"}
        </Button>
      </div>
    </form>
  );
}

export default function VendorEntriesPage() {
  const {
    entries,
    loading,
    error,
    refresh,
    addEntry,
    editEntry,
    removeEntry,
  } = useVendorEntries();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<VendorEntry | null>(null);
  const [viewing, setViewing] = useState<VendorEntry | null>(null);
  const [deleting, setDeleting] = useState<VendorEntry | null>(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchesSearch =
        !query ||
        [
          entry.eventName,
          entry.vendorName,
          entry.category,
          entry.status,
          entry.notes,
        ].some((value) => value.toLowerCase().includes(query));

      return (
        matchesSearch &&
        (statusFilter === "All" || entry.status === statusFilter)
      );
    });
  }, [entries, search, statusFilter]);

  const filteredTotal = filteredEntries.reduce(
    (total, entry) => total + entry.amount,
    0
  );

  async function saveEntry(values: VendorEntryFormValues) {
    setSaving(true);
    setActionError("");

    try {
      if (editing) {
        await editEntry(editing.id, values);
      } else {
        await addEntry(values);
      }
      setFormOpen(false);
      setEditing(null);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Could not save entry."
      );
      throw error;
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;

    setDeleteError("");
    try {
      await removeEntry(deleting.id);
      setDeleting(null);
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Could not delete entry."
      );
    }
  }

  function openEdit(entry: VendorEntry) {
    setViewing(null);
    setEditing(entry);
    setFormOpen(true);
  }

  return (
    <PageContainer>
      <main className="mx-auto w-full max-w-[1440px] space-y-5 pb-4">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">
              Eventify <span className="mx-1 text-slate-300">›</span> Vendor Entries
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              Vendor Entries
            </h1>
          </div>
          <Button
            className="h-9 gap-2 rounded-lg px-3.5 shadow-sm"
            onClick={() => {
              setEditing(null);
              setActionError("");
              setFormOpen(true);
            }}
          >
            <Plus size={16} /> Add Entry
          </Button>
        </header>

        {actionError && (
          <div role="alert" className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <span>{actionError}</span>
            <button onClick={() => setActionError("")} aria-label="Dismiss error">
              <X size={16} />
            </button>
          </div>
        )}

        <section className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div className="relative w-full sm:w-64">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`${fieldClass} mt-0 appearance-none pr-9`}
              aria-label="Filter vendor entries by status"
            >
              <option value="All">All statuses</option>
              {VENDOR_ENTRY_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search entries…"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <p className="whitespace-nowrap text-sm text-slate-500">
              Total: <span className="ml-1 font-semibold text-slate-900">{formatCurrency(filteredTotal)}</span>
            </p>
          </div>
        </section>

        {error && (
          <div role="alert" className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
            <span>Could not load vendor entries: {error}</span>
            <Button variant="outline" size="sm" onClick={() => void refresh()}>
              Try Again
            </Button>
          </div>
        )}

        {loading && entries.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
            Loading vendor entries…
          </div>
        ) : filteredEntries.length === 0 ? (
          <section className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm sm:py-16">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Plus size={22} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              {entries.length === 0 ? "No vendor entries yet" : "No entries found"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {entries.length === 0
                ? "Record vendor bookings and costs against your events to keep everything organised."
                : "Try another search or status filter."}
            </p>
            {entries.length === 0 ? (
              <Button
                className="mt-5 gap-2"
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
              >
                <Plus size={16} /> Add your first entry
              </Button>
            ) : (
              <Button
                variant="outline"
                className="mt-5"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
              >
                Clear filters
              </Button>
            )}
          </section>
        ) : (
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse text-left">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200 text-xs font-medium uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3.5">Event</th>
                    <th className="px-4 py-3.5">Vendor</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Amount</th>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Notes</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id} className="transition hover:bg-slate-50/70">
                      <td className="max-w-52 px-4 py-3.5 text-sm font-medium text-slate-800">
                        <span className="block truncate" title={entry.eventName}>{entry.eventName}</span>
                      </td>
                      <td className="max-w-56 px-4 py-3.5 text-sm text-slate-800">
                        <span className="block truncate" title={entry.vendorName}>{entry.vendorName}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                          {entry.category}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-sm font-semibold text-slate-900">
                        {formatCurrency(entry.amount)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-500">
                        {formatDate(entry.entryDate)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass(entry.status)}`}>
                          {entry.status}
                        </span>
                      </td>
                      <td className="max-w-52 px-4 py-3.5 text-sm text-slate-500">
                        <span className="block truncate" title={entry.notes}>{entry.notes || "—"}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setViewing(entry)}
                            className="flex size-8 items-center justify-center rounded-md text-slate-400 hover:bg-blue-50 hover:text-blue-700"
                            aria-label={`View ${entry.vendorName} entry`}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEdit(entry)}
                            className="flex size-8 items-center justify-center rounded-md text-slate-400 hover:bg-blue-50 hover:text-blue-700"
                            aria-label={`Edit ${entry.vendorName} entry`}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteError("");
                              setDeleting(entry);
                            }}
                            className="flex size-8 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"
                            aria-label={`Delete ${entry.vendorName} entry`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
              Showing {filteredEntries.length} of {entries.length} entries
            </div>
          </section>
        )}

        <Dialog open={formOpen} onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editing ? "Edit Vendor Entry" : "Add Vendor Entry"}
              </DialogTitle>
              <DialogDescription>
                Record a vendor booking or cost for an event.
              </DialogDescription>
            </DialogHeader>
            <VendorEntryForm
              key={editing?.id ?? "new-vendor-entry"}
              entry={editing}
              saving={saving}
              onCancel={() => {
                setFormOpen(false);
                setEditing(null);
              }}
              onSave={saveEntry}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(viewing)} onOpenChange={(open) => {
          if (!open) setViewing(null);
        }}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl">Vendor Entry Details</DialogTitle>
              <DialogDescription>
                Review the event booking and vendor cost.
              </DialogDescription>
            </DialogHeader>
            {viewing && (
              <div className="space-y-4">
                {[
                  ["Event", viewing.eventName],
                  ["Vendor", viewing.vendorName],
                  ["Category", viewing.category],
                  ["Amount", formatCurrency(viewing.amount)],
                  ["Date", formatDate(viewing.entryDate)],
                  ["Status", viewing.status],
                  ["Notes", viewing.notes || "—"],
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-slate-100 pb-3 last:border-0">
                    <p className="text-xs font-medium text-slate-500">{label}</p>
                    <p className="mt-1 break-words text-sm text-slate-800">{value}</p>
                  </div>
                ))}
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setViewing(null)}>
                    Close
                  </Button>
                  <Button onClick={() => openEdit(viewing)}>
                    <Pencil size={14} className="mr-2" /> Edit Entry
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(deleting)} onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete vendor entry?</DialogTitle>
              <DialogDescription>
                This permanently removes the entry for {deleting?.vendorName ?? "this vendor"}. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {deleteError && (
              <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {deleteError}
              </p>
            )}
            <div className="flex justify-end gap-2 pt-3">
              <Button variant="outline" onClick={() => setDeleting(null)}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => void confirmDelete()}
              >
                <Trash2 size={14} className="mr-2" /> Delete Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </PageContainer>
  );
}

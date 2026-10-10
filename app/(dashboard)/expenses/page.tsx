"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Eye,
  Pencil,
  Plus,
  ReceiptText,
  Tag,
  Trash2,
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
import { useEventCostObligations } from "@/features/expenses/hooks/useEventCostObligations";
import { updateEventCostObligation } from "@/features/expenses/services/eventCostObligation.service";
import { useManualExpenses } from "@/features/expenses/hooks/useManualExpenses";

import type { EventCostObligation } from "@/features/expenses/types";
import type {
  ExpenseType,
  ManualExpense,
  ManualExpenseInput,
} from "@/features/expenses/manual-expense.types";

type FilterType = "All" | ExpenseType;

type ExpenseRow = {
  id: string;
  source: "manual" | "obligation";
  eventId: string | null;
  eventName: string;
  category: string;
  vendorPayee: string;
  amount: number;
  date: string;
  type: ExpenseType;
  notes: string;
  manual?: ManualExpense;
  obligation?: EventCostObligation;
};

const CATEGORIES = [
  "Photography",
  "Decoration",
  "Catering",
  "Audio/Visual",
  "Lighting",
  "Transportation",
  "Venue",
  "Printing",
  "Staff",
  "Travel",
  "Equipment",
  "Office",
  "Utilities",
  "Marketing",
  "Other",
];

const fieldClass =
  "mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const blankInput = (): ManualExpenseInput => ({
  expenseType: "Event",
  eventId: "",
  category: "Other",
  vendorPayee: "",
  amount: 0,
  expenseDate: today(),
  notes: "",
});

function currency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function dateLabel(value: string) {
  if (!value) return "—";
  return new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString(
    "en-IN",
    { day: "2-digit", month: "short", year: "numeric" }
  );
}

function buildRows(
  manualExpenses: ManualExpense[],
  obligations: EventCostObligation[]
): ExpenseRow[] {
  const manualRows: ExpenseRow[] = manualExpenses.map((item) => ({
    id: `manual-${item.id}`,
    source: "manual",
    eventId: item.eventId,
    eventName: item.eventName || "—",
    category: item.category,
    vendorPayee: item.vendorPayee,
    amount: item.amount,
    date: item.expenseDate,
    type: item.expenseType,
    notes: item.notes,
    manual: item,
  }));

  const obligationRows: ExpenseRow[] = obligations.map((item) => ({
    id: `obligation-${item.id}`,
    source: "obligation",
    eventId: item.eventId,
    eventName: item.eventName,
    category: item.description,
    vendorPayee: item.owedTo,
    amount: item.amount,
    date: item.eventDate,
    type: "Event",
    notes: item.quotationNumber
      ? `Quotation ${item.quotationNumber}`
      : "Quotation expense",
    obligation: item,
  }));

  return [...manualRows, ...obligationRows].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  iconClass,
}: {
  label: string;
  value: string;
  description: string;
  icon: typeof ReceiptText;
  iconClass: string;
}) {
  return (
    <div className="flex min-h-[112px] items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-[22px] font-semibold leading-tight tracking-tight text-slate-900 tabular-nums">
          {value}
        </p>
        <p className="mt-1.5 text-xs text-slate-400">{description}</p>
      </div>
      <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
        <Icon size={18} strokeWidth={1.8} />
      </span>
    </div>
  );
}

function ExpenseForm({
  initial,
  saving,
  onCancel,
  onSave,
}: {
  initial: ManualExpenseInput;
  saving: boolean;
  onCancel: () => void;
  onSave: (input: ManualExpenseInput) => Promise<void>;
}) {
  const { events, loading: eventsLoading } = useEvents();
  const [form, setForm] = useState<ManualExpenseInput>(initial);
  const [error, setError] = useState("");

  function change<K extends keyof ManualExpenseInput>(
    key: K,
    value: ManualExpenseInput[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (form.expenseType === "Event" && !form.eventId) {
      setError("Select an event.");
      return;
    }

    if (!form.category.trim()) {
      setError("Select a category.");
      return;
    }

    if (!Number.isFinite(Number(form.amount)) || Number(form.amount) < 0) {
      setError("Enter a valid non-negative amount.");
      return;
    }

    if (!form.expenseDate) {
      setError("Select a date.");
      return;
    }

    try {
      await onSave({
        ...form,
        amount: Number(form.amount),
        eventId: form.expenseType === "Event" ? form.eventId : null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save expense.");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-600">
          Type *
          <select
            className={fieldClass}
            value={form.expenseType}
            onChange={(e) => {
              const type = e.target.value as ExpenseType;
              setForm((current) => ({
                ...current,
                expenseType: type,
                eventId: type === "Event" ? current.eventId : null,
              }));
            }}
          >
            <option value="Event">Event</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </label>

        <label className="text-xs font-medium uppercase tracking-wide text-slate-600">
          Event {form.expenseType === "Event" ? "*" : ""}
          <select
            className={fieldClass}
            value={form.eventId ?? ""}
            onChange={(e) => change("eventId", e.target.value || null)}
            disabled={form.expenseType === "Miscellaneous" || eventsLoading}
            required={form.expenseType === "Event"}
          >
            <option value="">
              {form.expenseType === "Miscellaneous"
                ? "Not linked to an event"
                : "Select event"}
            </option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.eventName}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-medium uppercase tracking-wide text-slate-600">
          Category *
          <select
            className={fieldClass}
            value={form.category}
            onChange={(e) => change("category", e.target.value)}
            required
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>

        <label className="text-xs font-medium uppercase tracking-wide text-slate-600">
          Vendor / Payee
          <input
            className={fieldClass}
            value={form.vendorPayee}
            onChange={(e) => change("vendorPayee", e.target.value)}
            placeholder="Vendor name"
          />
        </label>

        <label className="text-xs font-medium uppercase tracking-wide text-slate-600">
          Amount (₹) *
          <input
            className={fieldClass}
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) =>
              change(
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
            value={form.expenseDate}
            onChange={(e) => change("expenseDate", e.target.value)}
            required
          />
        </label>

        <label className="text-xs font-medium uppercase tracking-wide text-slate-600 sm:col-span-2">
          Notes
          <textarea
            className="mt-1.5 min-h-[68px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            value={form.notes}
            onChange={(e) => change("notes", e.target.value)}
            placeholder="Expense notes…"
            rows={2}
          />
        </label>
      </div>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving || eventsLoading}>
          {saving ? "Saving…" : "Save Expense"}
        </Button>
      </div>
    </form>
  );
}

export default function ExpensesPage() {
  const {
    obligations,
    loading: obligationsLoading,
    error: obligationsError,
    refresh: refreshObligations,
  } = useEventCostObligations();

  const {
    expenses: manualExpenses,
    loading: manualLoading,
    error: manualError,
    refresh: refreshManual,
    addExpense,
    editExpense,
    removeExpense,
  } = useManualExpenses();

  const [filter, setFilter] = useState<FilterType>("All");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ManualExpense | null>(null);
  const [viewing, setViewing] = useState<ExpenseRow | null>(null);
  const [editingObligation, setEditingObligation] = useState<EventCostObligation | null>(null);
  const [obligationAmount, setObligationAmount] = useState("");
  const [obligationPaid, setObligationPaid] = useState("");
  const [obligationPayee, setObligationPayee] = useState("");
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ManualExpense | null>(null);

  const allRows = useMemo(
    () => buildRows(manualExpenses, obligations),
    [manualExpenses, obligations]
  );

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allRows.filter((row) => {
      const matchesType = filter === "All" || row.type === filter;
      const matchesSearch = !query || [
        row.eventName,
        row.category,
        row.vendorPayee,
        row.notes,
        row.type,
      ].some((value) => value.toLowerCase().includes(query));
      return matchesType && matchesSearch;
    });
  }, [allRows, filter, search]);

  const eventTotal = allRows
    .filter((row) => row.type === "Event")
    .reduce((sum, row) => sum + row.amount, 0);

  const miscellaneousTotal = allRows
    .filter((row) => row.type === "Miscellaneous")
    .reduce((sum, row) => sum + row.amount, 0);

  const totalExpenses = eventTotal + miscellaneousTotal;
  const shownTotal = filteredRows.reduce((sum, row) => sum + row.amount, 0);
  const loading = obligationsLoading || manualLoading;
  const loadError = obligationsError || manualError;

  async function refreshAll() {
    await Promise.all([refreshObligations(), refreshManual()]);
  }

  function openCreate() {
    setEditing(null);
    setPageError("");
    setDialogOpen(true);
  }

  function openEditManual(expense: ManualExpense) {
    setViewing(null);
    setEditing(expense);
    setPageError("");
    setDialogOpen(true);
  }

  async function saveManual(input: ManualExpenseInput) {
    setSaving(true);
    setPageError("");

    try {
      if (editing) {
        await editExpense(editing.id, input);
      } else {
        await addExpense(input);
      }
      setDialogOpen(false);
      setEditing(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save expense.";
      setPageError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  }

  function openEditObligation(item: EventCostObligation) {
    setEditingObligation(item);
    setObligationAmount(String(item.amount));
    setObligationPaid(String(item.paid));
    setObligationPayee(item.owedTo);
    setPageError("");
  }

  async function saveObligation() {
    if (!editingObligation) return;

    const amount = Number(obligationAmount);
    const paid = Number(obligationPaid);

    if (!Number.isFinite(amount) || amount < 0 || !Number.isFinite(paid) || paid < 0 || paid > amount) {
      setPageError("Enter valid amounts. Paid cannot exceed Amount Owed.");
      return;
    }

    setSaving(true);
    setPageError("");

    try {
      await updateEventCostObligation(editingObligation.id, {
        amount,
        paid,
        owedTo: obligationPayee,
      });
      setEditingObligation(null);
      await refreshObligations();
    } catch (err) {
      setPageError(err instanceof Error ? err.message : "Could not update obligation.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setSaving(true);
    setPageError("");

    try {
      await removeExpense(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      setPageError(err instanceof Error ? err.message : "Could not delete expense.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageContainer>
      <div className="mx-auto w-full max-w-[1440px] space-y-5 pb-4">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Expenses</h1>
            <p className="mt-1 text-sm text-slate-500">
              Track event costs and miscellaneous business expenses.
            </p>
          </div>
          <Button onClick={openCreate} className="h-9 gap-2 rounded-lg px-3.5 shadow-sm">
            <Plus size={16} /> Add Expense
          </Button>
        </header>

        {pageError && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            {pageError}
          </div>
        )}

        {loadError && (
          <div role="alert" className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
            <span>{loadError}</span>
            <Button variant="outline" size="sm" onClick={() => void refreshAll()}>Try Again</Button>
          </div>
        )}

        <section aria-label="Expense summary" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            label="Total Expenses"
            value={loading ? "—" : currency(totalExpenses)}
            description="All recorded expense amounts"
            icon={ReceiptText}
            iconClass="bg-rose-50 text-rose-600"
          />
          <SummaryCard
            label="Event Expenses"
            value={loading ? "—" : currency(eventTotal)}
            description="Linked to events and quotations"
            icon={CalendarDays}
            iconClass="bg-blue-50 text-blue-600"
          />
          <SummaryCard
            label="Miscellaneous"
            value={loading ? "—" : currency(miscellaneousTotal)}
            description="Overhead expenses"
            icon={Tag}
            iconClass="bg-violet-50 text-violet-600"
          />
        </section>

        <section className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div className="flex flex-wrap gap-2">
            {(["All", "Event", "Miscellaneous"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`h-9 rounded-lg border px-3.5 text-sm font-medium transition ${
                  filter === item
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search expenses…"
              aria-label="Search expenses"
              className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-56"
            />
            <p className="whitespace-nowrap text-sm text-slate-500">
              Showing: <span className="ml-1 font-semibold text-slate-900">{currency(shownTotal)}</span>
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-1 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Expense records</h2>
              <p className="mt-1 text-xs text-slate-500">
                {loading ? "Loading expenses…" : `${filteredRows.length} record${filteredRows.length === 1 ? "" : "s"}`}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => void refreshAll()} disabled={loading}>
              {loading ? "Refreshing…" : "Refresh"}
            </Button>
          </div>

          {loading && allRows.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-slate-500">Loading expenses…</div>
          ) : filteredRows.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <ReceiptText size={22} className="mx-auto text-slate-400" />
              <p className="mt-3 text-sm font-semibold text-slate-800">
                {allRows.length === 0 ? "No expenses recorded yet" : "No matching expenses"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {allRows.length === 0
                  ? "Add a manual expense or accept a quotation with Our Expense items."
                  : "Try another filter or search term."}
              </p>
              {allRows.length === 0 && (
                <Button className="mt-4" onClick={openCreate}>Add Expense</Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse text-left">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200 text-xs font-medium uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3.5">Event</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Vendor</th>
                    <th className="px-4 py-3.5">Amount</th>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5">Type</th>
                    <th className="px-4 py-3.5">Notes</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRows.map((row) => (
                    <tr key={row.id} className="transition hover:bg-slate-50/70">
                      <td className="max-w-48 px-4 py-3.5 text-sm text-slate-800">
                        <span className="block truncate" title={row.eventName}>{row.eventName || "—"}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{row.category}</span>
                      </td>
                      <td className="max-w-48 px-4 py-3.5 text-sm text-slate-800">
                        <span className="block truncate" title={row.vendorPayee}>{row.vendorPayee || "—"}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-sm font-semibold text-red-600">{currency(row.amount)}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-500">{dateLabel(row.date)}</td>
                      <td className="px-4 py-3.5">
                        <span className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs ${
                          row.type === "Event"
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : "border-violet-200 bg-violet-50 text-violet-700"
                        }`}>{row.type}</span>
                      </td>
                      <td className="max-w-48 px-4 py-3.5 text-sm text-slate-500">
                        <span className="block truncate" title={row.notes}>{row.notes || "—"}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setViewing(row)}
                            aria-label="View expense"
                            className="flex size-8 items-center justify-center rounded-md text-slate-400 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => row.manual ? openEditManual(row.manual) : row.obligation && openEditObligation(row.obligation)}
                            aria-label="Edit expense"
                            className="flex size-8 items-center justify-center rounded-md text-slate-400 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Pencil size={16} />
                          </button>
                          {row.manual && (
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(row.manual!)}
                              aria-label="Delete expense"
                              className="flex size-8 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
            Showing {filteredRows.length} of {allRows.length} records
          </div>
        </section>

        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(null);
        }}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl">{editing ? "Edit Expense" : "Log Expense"}</DialogTitle>
              <DialogDescription>
                Record an event cost or miscellaneous business expense.
              </DialogDescription>
            </DialogHeader>
            <ExpenseForm
              key={editing?.id ?? "new-expense"}
              initial={editing ? {
                expenseType: editing.expenseType,
                eventId: editing.eventId,
                category: editing.category,
                vendorPayee: editing.vendorPayee,
                amount: editing.amount,
                expenseDate: editing.expenseDate,
                notes: editing.notes,
              } : blankInput()}
              saving={saving}
              onCancel={() => {
                setDialogOpen(false);
                setEditing(null);
              }}
              onSave={saveManual}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(viewing)} onOpenChange={(open) => {
          if (!open) setViewing(null);
        }}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl">Expense Details</DialogTitle>
              <DialogDescription>Review the selected expense record.</DialogDescription>
            </DialogHeader>
            {viewing && (
              <div className="space-y-4">
                {[
                  ["Event", viewing.eventName || "—"],
                  ["Category", viewing.category],
                  ["Vendor / Payee", viewing.vendorPayee || "—"],
                  ["Amount", currency(viewing.amount)],
                  ["Date", dateLabel(viewing.date)],
                  ["Type", viewing.type],
                  ["Notes", viewing.notes || "—"],
                  ["Record source", viewing.source === "manual" ? "Manual expense" : "Accepted quotation obligation"],
                  ...(viewing.obligation ? [
                    ["Already Paid", currency(viewing.obligation.paid)],
                    ["Remaining", currency(viewing.obligation.remaining)],
                  ] : []),
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-slate-100 pb-3 last:border-0">
                    <p className="text-xs font-medium text-slate-500">{label}</p>
                    <p className="mt-1 break-words text-sm text-slate-800">{value}</p>
                  </div>
                ))}
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(editingObligation)} onOpenChange={(open) => {
          if (!open) setEditingObligation(null);
        }}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl">Update Event Expense</DialogTitle>
              <DialogDescription>
                This record came from an accepted quotation. Its payment tracking will remain unchanged.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Amount Owed (₹)
                <input className={fieldClass} type="number" min="0" step="0.01" value={obligationAmount} onChange={(e) => setObligationAmount(e.target.value)} />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Already Paid (₹)
                <input className={fieldClass} type="number" min="0" step="0.01" value={obligationPaid} onChange={(e) => setObligationPaid(e.target.value)} />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Vendor / Payee
                <input className={fieldClass} value={obligationPayee} onChange={(e) => setObligationPayee(e.target.value)} placeholder="Vendor name" />
              </label>
              {pageError && <p role="alert" className="text-sm text-red-600">{pageError}</p>}
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <Button variant="outline" onClick={() => setEditingObligation(null)}>Cancel</Button>
                <Button onClick={() => void saveObligation()} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete this expense?</DialogTitle>
              <DialogDescription>
                This permanently deletes the manually logged expense. Quotation-generated obligations cannot be deleted here.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 pt-3">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button className="bg-red-600 text-white hover:bg-red-700" onClick={() => void confirmDelete()} disabled={saving}>
                {saving ? "Deleting…" : "Delete Expense"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
}
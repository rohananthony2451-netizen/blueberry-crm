
"use client";

import { useEffect, useState } from "react";

import { useEventCostObligations } from "@/features/expenses/hooks/useEventCostObligations";
import { updateEventCostObligation } from "@/features/expenses/services/eventCostObligation.service";
import type { EventCostObligation } from "@/features/expenses/types";

interface ObligationRowProps {
  item: EventCostObligation;
  saving: boolean;
  onSave: (
    id: string,
    values: {
      amount: number;
      paid: number;
      owedTo: string;
    }
  ) => Promise<void>;
}

interface EventGroup {
  eventId: string;
  eventName: string;
  eventDate: string;
  clientName: string;
  items: EventCostObligation[];
  totalOwed: number;
  totalPaid: number;
  totalRemaining: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string): string {
  if (!value) return "Date not available";

  return new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function getPaymentStatus(
  amount: number,
  paid: number
): {
  label: string;
  className: string;
} {
  if (paid === amount) {
    return {
      label: "Fully paid",
      className: "bg-emerald-50 text-emerald-700",
    };
  }

  if (paid > 0) {
    return {
      label: "Partially paid",
      className: "bg-amber-50 text-amber-700",
    };
  }

  return {
    label: "Unpaid",
    className: "bg-slate-100 text-slate-700",
  };
}

function SummaryCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

function ObligationRow({
  item,
  saving,
  onSave,
}: ObligationRowProps) {
  const [amount, setAmount] = useState(String(item.amount));
  const [paid, setPaid] = useState(String(item.paid));
  const [owedTo, setOwedTo] = useState(item.owedTo);
  const [localError, setLocalError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setAmount(String(item.amount));
    setPaid(String(item.paid));
    setOwedTo(item.owedTo);
    setLocalError(null);
    setSaved(false);
  }, [item.amount, item.paid, item.owedTo]);

  const numericAmount = Number(amount);
  const numericPaid = Number(paid);

  const validNumbers =
    amount.trim() !== "" &&
    paid.trim() !== "" &&
    Number.isFinite(numericAmount) &&
    Number.isFinite(numericPaid) &&
    numericAmount >= 0 &&
    numericPaid >= 0 &&
    numericPaid <= numericAmount;

  const remaining = validNumbers
    ? Math.max(0, numericAmount - numericPaid)
    : null;

  const status = validNumbers
    ? getPaymentStatus(numericAmount, numericPaid)
    : null;

  async function handleSave() {
    setLocalError(null);
    setSaved(false);

    if (!validNumbers) {
      setLocalError(
        "Enter valid non-negative amounts. Paid cannot exceed Amount Owed."
      );
      return;
    }

    try {
      await onSave(item.id, {
        amount: numericAmount,
        paid: numericPaid,
        owedTo,
      });
      setSaved(true);
    } catch (err) {
      setLocalError(
        err instanceof Error
          ? err.message
          : "Could not save this obligation."
      );
    }
  }

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h4 className="break-words font-semibold text-slate-900">
            {item.description}
          </h4>
          <p className="mt-1 text-xs text-slate-500">
            {item.quotationNumber
              ? `Quotation ${item.quotationNumber}`
              : "Quotation item"}
          </p>
        </div>

        {status && (
          <span
            className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
          >
            {status.label}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Amount Owed (₹)
          </span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              setSaved(false);
            }}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Already Paid (₹)
          </span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={paid}
            onChange={(event) => {
              setPaid(event.target.value);
              setSaved(false);
            }}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Owed To
          </span>
          <input
            type="text"
            value={owedTo}
            onChange={(event) => {
              setOwedTo(event.target.value);
              setSaved(false);
            }}
            placeholder="Name or business (optional)"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>

        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-sm font-medium text-slate-600">
            Remaining
          </p>
          <p className="mt-2 text-xl font-semibold text-slate-900">
            {remaining === null ? "—" : formatCurrency(remaining)}
          </p>
        </div>
      </div>

      {localError && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {localError}
        </p>
      )}

      {saved && (
        <p className="mt-3 text-sm text-emerald-700">
          Changes saved.
        </p>
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </article>
  );
}

function buildEventGroups(
  obligations: EventCostObligation[]
): EventGroup[] {
  const groups = new Map<string, EventGroup>();

  for (const item of obligations) {
    const existing = groups.get(item.eventId);

    if (existing) {
      existing.items.push(item);
      existing.totalOwed += item.amount;
      existing.totalPaid += item.paid;
      existing.totalRemaining += item.remaining;
      continue;
    }

    groups.set(item.eventId, {
      eventId: item.eventId,
      eventName: item.eventName,
      eventDate: item.eventDate,
      clientName: item.clientName,
      items: [item],
      totalOwed: item.amount,
      totalPaid: item.paid,
      totalRemaining: item.remaining,
    });
  }

  return Array.from(groups.values()).sort((a, b) => {
    const dateComparison = a.eventDate.localeCompare(b.eventDate);
    if (dateComparison !== 0) return dateComparison;
    return a.eventName.localeCompare(b.eventName);
  });
}

function EventObligationCard({
  group,
  savingId,
  onSave,
}: {
  group: EventGroup;
  savingId: string | null;
  onSave: ObligationRowProps["onSave"];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        className="w-full p-5 text-left transition hover:bg-slate-50 sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="break-words text-lg font-semibold text-slate-900">
                {group.eventName}
              </h3>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {group.items.length}{" "}
                {group.items.length === 1 ? "item" : "items"}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {group.clientName}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {formatDate(group.eventDate)}
            </p>
          </div>

          <span className="shrink-0 pt-1 text-slate-500" aria-hidden="true">
            {expanded ? "−" : "+"}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-500">
              Total Owed
            </p>
            <p className="mt-1 break-words text-base font-semibold text-slate-900">
              {formatCurrency(group.totalOwed)}
            </p>
          </div>

          <div className="rounded-lg bg-emerald-50/70 p-3">
            <p className="text-xs font-medium text-emerald-700">
              Already Paid
            </p>
            <p className="mt-1 break-words text-base font-semibold text-emerald-800">
              {formatCurrency(group.totalPaid)}
            </p>
          </div>

          <div className="rounded-lg bg-amber-50/70 p-3">
            <p className="text-xs font-medium text-amber-700">
              Still to Pay
            </p>
            <p className="mt-1 break-words text-base font-semibold text-amber-800">
              {formatCurrency(group.totalRemaining)}
            </p>
          </div>
        </div>

        <p className="mt-3 text-xs font-medium text-slate-500">
          {expanded
            ? "Hide expense details"
            : "Open to view and edit individual expenses"}
        </p>
      </button>

      {expanded && (
        <div className="space-y-3 border-t border-slate-200 bg-slate-50/60 p-4 sm:p-5">
          {group.items.map((item) => (
            <ObligationRow
              key={item.id}
              item={item}
              saving={savingId === item.id}
              onSave={onSave}
            />
          ))}
        </div>
      )}
    </article>
  );
}

export default function ExpensesPage() {
  const {
    obligations,
    loading,
    error,
    refresh,
  } = useEventCostObligations();

  const [savingId, setSavingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const totalOwed = obligations.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const totalPaid = obligations.reduce(
    (sum, item) => sum + item.paid,
    0
  );

  const totalRemaining = obligations.reduce(
    (sum, item) => sum + item.remaining,
    0
  );

  const unassignedCount = obligations.filter(
    (item) => !item.owedTo.trim()
  ).length;

  const eventGroups = buildEventGroups(obligations);

  async function handleSave(
    id: string,
    values: {
      amount: number;
      paid: number;
      owedTo: string;
    }
  ) {
    setSavingId(id);
    setActionError(null);

    try {
      await updateEventCostObligation(id, values);
      await refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not save the obligation.";

      setActionError(message);
      throw new Error(message);
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Event finances
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Money We Owe
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            View expenses by event, see the overall balance,
            and edit individual payments without mixing events together.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="w-fit rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Owed"
          value={formatCurrency(totalOwed)}
          description="Total amount recorded for obligations"
        />
        <SummaryCard
          label="Already Paid"
          value={formatCurrency(totalPaid)}
          description="Payments recorded so far"
        />
        <SummaryCard
          label="Still to Pay"
          value={formatCurrency(totalRemaining)}
          description="Outstanding obligation balance"
        />
        <SummaryCard
          label="Recipient Not Added"
          value={String(unassignedCount)}
          description="Items without an Owed To name"
        />
      </section>

      {actionError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {actionError}
        </div>
      )}

      {loading && obligations.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <p className="font-medium text-slate-800">
            Loading obligations...
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Fetching financial records for your workspace.
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-800">
            Could not load obligations
          </h2>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => void refresh()}
            className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && obligations.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            No obligations yet
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
            When a quotation is accepted, its items marked
            Our Expense will appear here. Draft and sent
            quotations do not create obligations.
          </p>
        </div>
      )}

      {!error && eventGroups.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Expenses by event
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {eventGroups.length}{" "}
              {eventGroups.length === 1 ? "event" : "events"} ·{" "}
              {obligations.length}{" "}
              {obligations.length === 1 ? "expense item" : "expense items"}.
              Open an event to view and edit its individual expenses.
            </p>
          </div>

          <div className="space-y-4">
            {eventGroups.map((group) => (
              <EventObligationCard
                key={group.eventId}
                group={group}
                savingId={savingId}
                onSave={handleSave}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
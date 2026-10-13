"use client";

import { useEffect, useState } from "react";
import { History, LoaderCircle, Plus, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AuditEntry {
  id: string;
  entity_type: "quotation" | "quotation_item";
  action: "INSERT" | "UPDATE" | "DELETE";
  actor_name: string;
  changed_at: string;
  before_data: Record<string, unknown> | null;
  after_data: Record<string, unknown> | null;
}

interface Props {
  quotationId: string;
  open: boolean;
}

const FIELD_LABELS: Record<string, string> = {
  quotation_date: "Quotation date",
  valid_until: "Valid until",
  status: "Status",
  subtotal: "Subtotal",
  discount: "Discount",
  tax: "Tax",
  total: "Total",
  notes: "Notes",
  prospect_name: "Prospect",
  prospect_phone: "Phone",
  prospect_email: "Email",
  prospect_address: "Address",
  event_name: "Event name",
  event_type: "Event type",
  event_date: "Event date",
  venue: "Venue",
  guest_count: "Guests",
  description: "Description",
  quantity: "Quantity",
  unit_price: "Unit price",
  amount: "Item amount",
  our_expense: "Internal expense",
};

const IGNORED_FIELDS = new Set([
  "id",
  "organization_id",
  "quotation_id",
  "created_at",
  "updated_at",
]);

function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "Empty";
  }

  if (typeof value === "boolean") return value ? "Yes" : "No";

  if (typeof value === "object") return JSON.stringify(value);

  return String(value);
}

function getChanges(entry: AuditEntry) {
  if (entry.action === "INSERT") {
    const data = entry.after_data ?? {};
    const fields =
      entry.entity_type === "quotation_item"
        ? ["description", "quantity", "unit_price", "amount", "our_expense"]
        : ["status", "subtotal", "discount", "tax", "total"];

    return fields
      .filter((key) => key in data)
      .map((key) => ({
        label: FIELD_LABELS[key] ?? key,
        before: null,
        after: data[key],
      }));
  }

  if (entry.action === "DELETE") {
    const data = entry.before_data ?? {};

    if (entry.entity_type === "quotation" && Array.isArray(data.items)) {
      return [
        {
          label: "Quotation",
          before: "Existing quotation",
          after: "Deleted",
        },
        {
          label: "Items preserved in history",
          before: null,
          after: `${data.items.length} item(s)`,
        },
      ];
    }

    return [
      {
        label: "Removed item",
        before: data.description ?? "Existing record",
        after: "Removed",
      },
    ];
  }

  const before = entry.before_data ?? {};
  const after = entry.after_data ?? {};

  return Object.keys(after)
    .filter(
      (key) =>
        !IGNORED_FIELDS.has(key) &&
        JSON.stringify(before[key]) !== JSON.stringify(after[key])
    )
    .map((key) => ({
      label: FIELD_LABELS[key] ?? key.replaceAll("_", " "),
      before: before[key],
      after: after[key],
    }));
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function QuotationAuditHistory({ quotationId, open }: Props) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !quotationId) return;

    let cancelled = false;

    async function loadHistory() {
      setLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        const { data, error: queryError } = await supabase
          .from("quotation_audit_logs")
          .select(
            "id, entity_type, action, actor_name, changed_at, before_data, after_data"
          )
          .eq("quotation_id", quotationId)
          .order("changed_at", { ascending: false });

        if (queryError) throw queryError;

        if (!cancelled) setEntries((data ?? []) as AuditEntry[]);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load quotation history."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [quotationId, open]);

  return (
    <section className="border-t border-slate-200 pt-3">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <History size={16} />
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">
            Edit history
          </h3>
          <p className="text-xs text-slate-500">
            Changes recorded for this quotation
          </p>
        </div>

        {!loading && entries.length > 0 && (
          <span className="ml-auto rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-4 text-sm text-slate-500">
          <LoaderCircle size={15} className="animate-spin" />
          Loading history…
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          Unable to load edit history: {error}
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-sm text-slate-500">
          No recorded changes yet.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
          {entries.map((entry) => {
            const changes = getChanges(entry);
            const isInsert = entry.action === "INSERT";
            const isDelete = entry.action === "DELETE";
            const ActionIcon = isInsert ? Plus : isDelete ? Trash2 : Pencil;

            return (
              <article key={entry.id} className="px-3 py-2.5 sm:px-4">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md ${
                      isInsert
                        ? "bg-emerald-50 text-emerald-700"
                        : isDelete
                          ? "bg-red-50 text-red-600"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <ActionIcon size={14} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-medium text-slate-900">
                        {isInsert ? "Created" : isDelete ? "Removed" : "Updated"}{" "}
                        {entry.entity_type === "quotation_item"
                          ? "quotation item"
                          : "quotation"}
                      </p>

                      <time className="text-xs text-slate-400">
                        {formatTimestamp(entry.changed_at)}
                      </time>
                    </div>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {entry.actor_name || "Unknown user"}
                    </p>

                    {changes.length > 0 && (
                      <div className="mt-2.5 space-y-2">
                        {changes.map((change, index) => (
                          <div
                            key={`${entry.id}-${index}`}
                            className="grid grid-cols-1 gap-0.5 text-xs sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-3"
                          >
                            <span className="font-medium capitalize text-slate-500">
                              {change.label}
                            </span>

                            <span className="min-w-0 break-words text-slate-700">
                              {entry.action === "UPDATE" ? (
                                <>
                                  <span className="text-slate-400">
                                    {displayValue(change.before)}
                                  </span>
                                  <span className="mx-1.5 text-slate-300">
                                    →
                                  </span>
                                  <span className="font-medium text-slate-900">
                                    {displayValue(change.after)}
                                  </span>
                                </>
                              ) : isDelete ? (
                                <>
                                  <span className="text-slate-500">
                                    {displayValue(change.before)}
                                  </span>
                                  <span className="mx-1.5 text-slate-300">
                                    →
                                  </span>
                                  <span className="font-medium text-red-600">
                                    {displayValue(change.after)}
                                  </span>
                                </>
                              ) : (
                                <span className="font-medium text-slate-800">
                                  {displayValue(change.after)}
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
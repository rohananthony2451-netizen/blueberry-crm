import {
  Eye,
  Pencil,
  Download,
  Trash2,
  Send,
  Check,
  X,
} from "lucide-react";

import type {
  Quotation,
  QuotationStatus,
} from "../types";

import { QuotationStatusBadge } from "./QuotationStatusBadge";

interface QuotationRowProps {
  quotation: Quotation;
  onView?: (quotation: Quotation) => void;
  onEdit?: (quotation: Quotation) => void;
  onDelete?: (quotation: Quotation) => void;
  onStatusChange?: (
    quotation: Quotation,
    status: QuotationStatus
  ) => void | Promise<void>;
  statusActionLoading?: boolean;
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function QuotationRow({
  quotation,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  statusActionLoading = false,
}: QuotationRowProps) {
  return (
    <tr className="border-t border-slate-100 transition-colors hover:bg-slate-50/70">
      <td className="px-4 py-4 font-medium text-primary">
        {quotation.quotationNumber}
      </td>

      <td className="px-4 py-4 font-medium">
        {quotation.clientName}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {quotation.eventName ?? "—"}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {formatDate(
          quotation.quotationDate
        )}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {formatDate(
          quotation.validUntil
        )}
      </td>

      <td className="px-4 py-4 text-right font-medium">
        {formatCurrency(
          quotation.total
        )}
      </td>

      <td className="px-4 py-4">
        <QuotationStatusBadge
          status={quotation.status}
        />
      </td>

      <td className="px-4 py-4">
        <div className="flex min-w-[220px] flex-wrap justify-end gap-1.5">
          {quotation.status === "Draft" && (
            <button
              type="button"
              disabled={statusActionLoading}
              onClick={() =>
                onStatusChange?.(
                  quotation,
                  "Sent"
                )
              }
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={13} />
              {statusActionLoading
                ? "Sending..."
                : "Send"}
            </button>
          )}

          {quotation.status === "Sent" && (
            <>
              <button
                type="button"
                disabled={
                  statusActionLoading
                }
                onClick={() =>
                  onStatusChange?.(
                    quotation,
                    "Accepted"
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={13} />
                {statusActionLoading
                  ? "Updating..."
                  : "Accept"}
              </button>

              <button
                type="button"
                disabled={
                  statusActionLoading
                }
                onClick={() =>
                  onStatusChange?.(
                    quotation,
                    "Rejected"
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={13} />
                {statusActionLoading
                  ? "Updating..."
                  : "Reject"}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() =>
              onView?.(quotation)
            }
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="View quotation"
            title="View quotation"
          >
            <Eye size={16} />
          </button>

          <button
            type="button"
            onClick={() =>
              onEdit?.(quotation)
            }
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Edit quotation"
            title="Edit quotation"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Download quotation"
            title="Download quotation"
          >
            <Download size={16} />
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete?.(quotation)
            }
            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            aria-label="Delete quotation"
            title="Delete quotation"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
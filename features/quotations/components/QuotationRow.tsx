import {
  Eye,
  Pencil,
  Download,
  Trash2,
} from "lucide-react";

import type { Quotation } from "../types";
import { QuotationStatusBadge } from "./QuotationStatusBadge";

interface QuotationRowProps {
  quotation: Quotation;
  onView?: (quotation: Quotation) => void;
  onEdit?: (quotation: Quotation) => void;
  onDelete?: (quotation: Quotation) => void;
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
        {formatDate(quotation.quotationDate)}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {formatDate(quotation.validUntil)}
      </td>

      <td className="px-4 py-4 text-right font-medium">
        {formatCurrency(quotation.total)}
      </td>

      <td className="px-4 py-4">
        <QuotationStatusBadge
          status={quotation.status}
        />
      </td>

      <td className="px-4 py-4">
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => onView?.(quotation)}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="View quotation"
          >
            <Eye size={16} />
          </button>

          <button
            type="button"
            onClick={() => onEdit?.(quotation)}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Edit quotation"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Download quotation"
          >
            <Download size={16} />
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(quotation)}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            aria-label="Delete quotation"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
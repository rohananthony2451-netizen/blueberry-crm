import { Eye, Pencil, Download } from "lucide-react";

import { Quotation } from "../types";
import { QuotationStatusBadge } from "./QuotationStatusBadge";

interface QuotationRowProps {
  quotation: Quotation;
}

function formatDate(
  value: string | null
) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(new Date(value));
}

function formatCurrency(
  value: number
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(value);
}

export function QuotationRow({
  quotation,
}: QuotationRowProps) {
  return (
    <tr className="border-t border-slate-100 transition-colors hover:bg-slate-50/70">

      <td className="px-5 py-4">
        <span className="font-medium text-blue-600">
          {quotation.quotationNumber}
        </span>
      </td>

      <td className="px-5 py-4 font-medium text-slate-900">
        {quotation.clientName}
      </td>

      <td className="px-5 py-4 text-slate-600">
        {quotation.eventName ?? "—"}
      </td>

      <td className="px-5 py-4 text-slate-600">
        {formatDate(
          quotation.quotationDate
        )}
      </td>

      <td className="px-5 py-4 text-slate-600">
        {formatDate(
          quotation.validUntil
        )}
      </td>

      <td className="px-5 py-4 font-semibold text-slate-900">
        {formatCurrency(
          quotation.total
        )}
      </td>

      <td className="px-5 py-4">
        <QuotationStatusBadge
          status={quotation.status}
        />
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-1">

          <button
            type="button"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="View quotation"
          >
            <Eye size={16} />
          </button>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Edit quotation"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Download quotation"
          >
            <Download size={16} />
          </button>

        </div>
      </td>

    </tr>
  );
}
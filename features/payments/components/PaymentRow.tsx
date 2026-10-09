
import { Pencil, Trash2 } from "lucide-react";
import type { Payment } from "../types";
import { PaymentMethodBadge } from "./PaymentMethodBadge";

interface PaymentRowProps {
  payment: Payment;
  balance?: number;
  onEdit?: (payment: Payment) => void;
  onDelete?: (payment: Payment) => void;
}

function formatDate(value: string) {
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PaymentRow({
  payment,
  balance,
  onEdit,
  onDelete,
}: PaymentRowProps) {
  return (
    <tr className="transition-colors hover:bg-slate-50/80">
      <td className="px-3 py-3 sm:px-3.5">
        <span className="block truncate font-semibold text-blue-700">
          {payment.paymentNumber}
        </span>
      </td>

      <td className="px-3 py-3 sm:px-3.5">
        <span className="block truncate font-medium text-slate-800">
          {payment.clientName}
        </span>
      </td>

      <td className="px-3 py-3 sm:px-3.5">
        <span className="block truncate text-slate-600">
          {payment.eventName || "—"}
        </span>
      </td>

      <td className="whitespace-nowrap px-3 py-3 text-slate-600 sm:px-3.5">
        {formatDate(payment.paymentDate)}
      </td>

      <td className="px-3 py-3 sm:px-3.5">
        <PaymentMethodBadge method={payment.paymentMethod} />
      </td>

      <td className="whitespace-nowrap px-3 py-3 text-right font-semibold tabular-nums text-emerald-700 sm:px-3.5">
        {formatCurrency(payment.amount)}
      </td>

      <td className="whitespace-nowrap px-3 py-3 text-right sm:px-3.5">
        {balance === undefined ? (
          <span className="text-slate-400">—</span>
        ) : (
          <span
            className={`font-medium tabular-nums ${
              balance > 0 ? "text-amber-600" : "text-slate-500"
            }`}
            title="Outstanding balance on the linked quotation"
          >
            {formatCurrency(balance)}
          </span>
        )}
      </td>

      <td className="px-1 py-2">
        <div className="flex items-center justify-center gap-0.5">
          <button
            type="button"
            onClick={() => onEdit?.(payment)}
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={`Edit ${payment.paymentNumber}`}
            title="Edit payment"
          >
            <Pencil size={14} />
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(payment)}
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            aria-label={`Delete ${payment.paymentNumber}`}
            title="Delete payment"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

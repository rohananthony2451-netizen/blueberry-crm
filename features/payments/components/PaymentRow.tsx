import {
  Pencil,
  Trash2,
} from "lucide-react";

import type {
  Payment,
} from "../types";

import {
  PaymentMethodBadge,
} from "./PaymentMethodBadge";

interface PaymentRowProps {
  payment: Payment;

  onEdit?: (
    payment: Payment
  ) => void;

  onDelete?: (
    payment: Payment
  ) => void;
}

function formatDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(
    new Date(value)
  );
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

export function PaymentRow({
  payment,
  onEdit,
  onDelete,
}: PaymentRowProps) {
  return (
    <tr className="border-t border-slate-100 transition-colors hover:bg-slate-50/70">
      <td className="px-4 py-4 font-medium text-primary">
        {payment.paymentNumber}
      </td>

      <td className="px-4 py-4 font-medium">
        {payment.clientName}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {payment.eventName ??
          "—"}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {payment.quotationNumber ??
          "—"}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {formatDate(
          payment.paymentDate
        )}
      </td>

      <td className="px-4 py-4">
        <PaymentMethodBadge
          method={
            payment.paymentMethod
          }
        />
      </td>

      <td className="px-4 py-4 text-right font-semibold text-green-600">
        {formatCurrency(
          payment.amount
        )}
      </td>

      <td className="max-w-xs px-4 py-4 text-slate-600">
        {payment.notes || "—"}
      </td>

      <td className="px-4 py-4">
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() =>
              onEdit?.(payment)
            }
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Edit payment"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete?.(payment)
            }
            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            aria-label="Delete payment"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
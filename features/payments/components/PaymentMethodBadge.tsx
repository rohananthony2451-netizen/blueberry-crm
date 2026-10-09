
import type { PaymentMethod } from "../types";

interface PaymentMethodBadgeProps {
  method: PaymentMethod;
}

const METHOD_STYLES: Record<PaymentMethod, string> = {
  Cash: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  UPI: "bg-violet-50 text-violet-700 ring-violet-600/15",
  "Bank Transfer": "bg-blue-50 text-blue-700 ring-blue-600/15",
  Card: "bg-indigo-50 text-indigo-700 ring-indigo-600/15",
  Cheque: "bg-amber-50 text-amber-700 ring-amber-600/15",
  Other: "bg-slate-100 text-slate-600 ring-slate-500/15",
};

export function PaymentMethodBadge({
  method,
}: PaymentMethodBadgeProps) {
  return (
    <span
      className={`inline-flex max-w-full items-center whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-medium ring-1 ring-inset ${METHOD_STYLES[method]}`}
    >
      {method}
    </span>
  );
}

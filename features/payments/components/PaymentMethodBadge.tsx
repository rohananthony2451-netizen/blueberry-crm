import type { PaymentMethod } from "../types";

interface PaymentMethodBadgeProps {
  method: PaymentMethod;
}

export function PaymentMethodBadge({
  method,
}: PaymentMethodBadgeProps) {
  return (
    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
      {method}
    </span>
  );
}
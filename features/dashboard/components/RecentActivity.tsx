import {
  ArrowDownLeft,
  CreditCard,
} from "lucide-react";

import type { Payment } from "@/features/payments/types";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  return new Date(
    date.includes("T")
      ? date
      : `${date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

export function RecentActivity({
  payments,
}: {
  payments: Payment[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            Activity
          </p>

          <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
            Recent payments
          </h3>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <CreditCard className="h-4 w-4" />
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm font-medium text-slate-700">
            No payments recorded
          </p>

          <p className="mt-1 text-xs text-slate-400">
            New payment activity will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-5 divide-y divide-slate-100">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <ArrowDownLeft className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {payment.clientName}
                </p>

                <p className="mt-0.5 truncate text-xs text-slate-400">
                  {payment.paymentNumber || "Payment"}{" "}
                  ·{" "}
                  {formatDate(payment.paymentDate)}
                </p>
              </div>

              <p className="shrink-0 text-sm font-bold text-emerald-600">
                +{formatCurrency(payment.amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
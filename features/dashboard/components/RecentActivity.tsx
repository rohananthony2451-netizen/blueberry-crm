
import { Card } from "@/components/ui/card";
import type { Payment } from "@/features/payments/types";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function RecentActivity({
  payments,
}: {
  payments: Payment[];
}) {
  return (
    <Card className="rounded-2xl p-6">
      <h3 className="mb-5 text-lg font-semibold">
        Recent Payments
      </h3>

      {payments.length === 0 ? (
        <p className="py-6 text-sm text-slate-500">
          No payments have been recorded yet.
        </p>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="border-b pb-3 last:border-none"
            >
              <p className="font-medium">
                {formatCurrency(payment.amount)} received
              </p>
              <p className="text-sm text-slate-500">
                {payment.clientName}
                {payment.paymentNumber
                  ? ` · ${payment.paymentNumber}`
                  : ""}
              </p>
              <p className="text-xs text-slate-400">
                {new Date(
                  payment.paymentDate.includes("T")
                    ? payment.paymentDate
                    : `${payment.paymentDate}T00:00:00`
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

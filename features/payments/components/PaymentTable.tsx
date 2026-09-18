import type { Payment } from "../types";
import { PaymentTableBody } from "./PaymentTableBody";

interface PaymentTableProps {
  payments: Payment[];
}

export function PaymentTable({
  payments,
}: PaymentTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-background">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50/70 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">
                Payment No.
              </th>

              <th className="px-4 py-3">
                Client
              </th>

              <th className="px-4 py-3">
                Event
              </th>

              <th className="px-4 py-3">
                Quotation
              </th>

              <th className="px-4 py-3">
                Date
              </th>

              <th className="px-4 py-3">
                Mode
              </th>

              <th className="px-4 py-3 text-right">
                Amount
              </th>

              <th className="px-4 py-3">
                Notes
              </th>
            </tr>
          </thead>

          <PaymentTableBody
            payments={payments}
          />
        </table>
      </div>
    </div>
  );
}
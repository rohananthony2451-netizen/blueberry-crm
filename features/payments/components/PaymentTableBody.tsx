
import type { Payment } from "../types";
import { PaymentRow } from "./PaymentRow";

interface PaymentTableBodyProps {
  payments: Payment[];
  balanceByQuotation: Record<string, number>;
  onEdit?: (payment: Payment) => void;
  onDelete?: (payment: Payment) => void;
}

export function PaymentTableBody({
  payments,
  balanceByQuotation,
  onEdit,
  onDelete,
}: PaymentTableBodyProps) {
  if (payments.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={8}
            className="px-4 py-10 text-center text-sm text-slate-500"
          >
            No payments found.
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="divide-y divide-slate-100">
      {payments.map((payment) => (
        <PaymentRow
          key={payment.id}
          payment={payment}
          balance={
            payment.quotationId
              ? balanceByQuotation[payment.quotationId]
              : undefined
          }
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </tbody>
  );
}

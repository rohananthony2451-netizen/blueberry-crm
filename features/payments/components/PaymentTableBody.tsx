import type {
  Payment,
} from "../types";

import {
  PaymentRow,
} from "./PaymentRow";

interface PaymentTableBodyProps {
  payments: Payment[];

  onEdit?: (
    payment: Payment
  ) => void;

  onDelete?: (
    payment: Payment
  ) => void;
}

export function PaymentTableBody({
  payments,
  onEdit,
  onDelete,
}: PaymentTableBodyProps) {
  if (payments.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={9}
            className="px-4 py-12 text-center text-sm text-slate-500"
          >
            No payments found.
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {payments.map(
        (payment) => (
          <PaymentRow
            key={payment.id}
            payment={payment}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )
      )}
    </tbody>
  );
}
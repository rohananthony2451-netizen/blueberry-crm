
import type { Payment } from "../types";
import { PaymentTableBody } from "./PaymentTableBody";

interface PaymentTableProps {
  payments: Payment[];
  balanceByQuotation: Record<string, number>;
  onEdit?: (payment: Payment) => void;
  onDelete?: (payment: Payment) => void;
}

export function PaymentTable({
  payments,
  balanceByQuotation,
  onEdit,
  onDelete,
}: PaymentTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[940px] table-fixed text-[13px]">
        <colgroup>
          <col style={{ width: "14%" }} />
          <col style={{ width: "17%" }} />
          <col style={{ width: "17%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "6%" }} />
        </colgroup>

        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 text-left">
            {[
              "Payment No.",
              "Client",
              "Event",
              "Date",
              "Mode",
              "Amount",
              "Balance",
            ].map((heading) => (
              <th
                key={heading}
                className={`whitespace-nowrap px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-500 sm:px-3.5 ${
                  heading === "Amount" || heading === "Balance"
                    ? "text-right"
                    : ""
                }`}
              >
                {heading}
              </th>
            ))}
            <th className="px-1 py-2.5" aria-label="Actions" />
          </tr>
        </thead>

        <PaymentTableBody
          payments={payments}
          balanceByQuotation={balanceByQuotation}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </table>
    </div>
  );
}

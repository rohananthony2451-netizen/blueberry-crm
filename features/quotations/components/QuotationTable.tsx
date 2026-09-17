import type { Quotation } from "../types";
import { QuotationTableBody } from "./QuotationTableBody";

interface QuotationTableProps {
  quotations: Quotation[];
  onView?: (
    quotation: Quotation
  ) => void;
  onEdit?: (
    quotation: Quotation
  ) => void;
}

export function QuotationTable({
  quotations,
  onView,
  onEdit,
}: QuotationTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-background">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50/70 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">
                Quotation No.
              </th>

              <th className="px-4 py-3">
                Client
              </th>

              <th className="px-4 py-3">
                Event
              </th>

              <th className="px-4 py-3">
                Date
              </th>

              <th className="px-4 py-3">
                Valid Until
              </th>

              <th className="px-4 py-3 text-right">
                Amount
              </th>

              <th className="px-4 py-3">
                Status
              </th>

              <th className="px-4 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <QuotationTableBody
            quotations={quotations}
            onView={onView}
            onEdit={onEdit}
          />
        </table>
      </div>
    </div>
  );
}
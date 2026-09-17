import type { Quotation } from "../types";
import { QuotationRow } from "./QuotationRow";

interface QuotationTableBodyProps {
  quotations: Quotation[];
  onView?: (
    quotation: Quotation
  ) => void;
  onEdit?: (
    quotation: Quotation
  ) => void;
  onDelete?: (quotation: Quotation) => void;
}

export function QuotationTableBody({
  quotations,
  onView,
  onEdit,
  onDelete,
}: QuotationTableBodyProps) {
  if (quotations.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={8}
            className="px-4 py-12 text-center text-sm text-slate-500"
          >
            No quotations found.
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {quotations.map(
        (quotation) => (
          <QuotationRow
            key={quotation.id}
            quotation={quotation}
            onView={onView}
            onEdit={onEdit}
             onDelete={onDelete}
          />
        )
      )}
    </tbody>
  );
}
import type {
  Quotation,
  QuotationStatus,
} from "../types";

import { QuotationRow } from "./QuotationRow";

interface QuotationTableBodyProps {
  quotations: Quotation[];
  onView?: (quotation: Quotation) => void;
  onEdit?: (quotation: Quotation) => void;
  onDelete?: (quotation: Quotation) => void;
  onStatusChange?: (
    quotation: Quotation,
    status: QuotationStatus
  ) => void | Promise<void>;
  statusActionLoadingId?: string | null;
}

export function QuotationTableBody({
  quotations,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  statusActionLoadingId,
}: QuotationTableBodyProps) {
  if (quotations.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={8}
            className="px-6 py-12 text-center text-sm text-slate-500"
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
            onStatusChange={
              onStatusChange
            }
            statusActionLoading={
              statusActionLoadingId ===
              quotation.id
            }
          />
        )
      )}
    </tbody>
  );
}
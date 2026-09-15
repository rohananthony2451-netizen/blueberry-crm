import { Quotation } from "../types";
import { QuotationRow } from "./QuotationRow";

import { TableEmpty } from "@/components/tables/TableEmpty";

interface QuotationTableBodyProps {
  quotations: Quotation[];
}

export function QuotationTableBody({
  quotations,
}: QuotationTableBodyProps) {
  return (
    <tbody>
      {quotations.length === 0 ? (
        <TableEmpty
          message="No quotations found."
        />
      ) : (
        quotations.map((quotation) => (
          <QuotationRow
            key={quotation.id}
            quotation={quotation}
          />
        ))
      )}
    </tbody>
  );
}
import { Lead } from "../types";
import { LeadRow } from "./LeadRow";
import { TableEmpty } from "@/components/tables/TableEmpty";

interface LeadTableBodyProps {
  leads: Lead[];
  onEdit?: (
    id: string,
    data: Partial<Lead>
  ) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function LeadTableBody({
  leads,
  onEdit,
  onDelete,
}: LeadTableBodyProps) {
  return (
    <tbody>
      {leads.length === 0 ? (
        <TableEmpty message="No leads found." />
      ) : (
        leads.map((lead) => (
          <LeadRow
            key={lead.id}
            lead={lead}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </tbody>
  );
}
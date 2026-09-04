import { Lead } from "../types";
import { LeadRow } from "./LeadRow";
import { TableEmpty } from "@/components/tables/TableEmpty";

interface LeadTableBodyProps {
  leads: Lead[];
  onUpdateLead: (
    id: string,
    data: Partial<Lead>
  ) => Promise<Lead>;
}

export function LeadTableBody({
  leads,
  onUpdateLead,
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
            onUpdateLead={onUpdateLead}
          />
        ))
      )}
    </tbody>
  );
}
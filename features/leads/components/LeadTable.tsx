import { Lead } from "../types";
import { Card } from "@/components/ui/card";
import { TableFooter } from "@/components/tables/TableFooter";
import { LeadTableHeader } from "./LeadTableHeader";
import { LeadTableBody } from "./LeadTableBody";

interface LeadTableProps {
  leads: Lead[];
  onUpdateLead: (
    id: string,
    data: Partial<Lead>
  ) => Promise<Lead>;
}

export function LeadTable({
  leads,
  onUpdateLead,
}: LeadTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl">
      <table className="w-full">
        <LeadTableHeader />

<LeadTableBody
  leads={leads}
  onUpdateLead={onUpdateLead}
/>
      </table>
      <TableFooter />
    </Card>
  );
}
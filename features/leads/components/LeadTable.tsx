import { Lead } from "../types";
import { Card } from "@/components/ui/card";
import { LeadRow } from "./LeadRow";
import { TableHeader } from "@/components/tables/TableHeader";
import { TableEmpty } from "@/components/tables/TableEmpty";
import { TableFooter } from "@/components/tables/TableFooter";

interface LeadTableProps {
    leads: Lead[];
}

export function LeadTable({
    leads,
}: LeadTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl">
      <table className="w-full">
        <TableHeader
         headers={[
         "Client",
        "Event",
         "Date",
        "Budget",
    "Status",
    "Source",
    "Assigned",
  ]}
/>

        <tbody>
  {leads.length === 0 ? (
    <TableEmpty message="No leads found." />
  ) : (
    leads.map(lead => (
      <LeadRow
        key={lead.id}
        lead={lead}
      />
    ))
  )}
</tbody>
      </table>
      <TableFooter />
    </Card>
  );
}
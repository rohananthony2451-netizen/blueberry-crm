import { Card } from "@/components/ui/card";

import { mockLeads } from "../data/mock-leads";
import { LeadRow } from "./LeadRow";
import { TableHeader } from "@/components/tables/TableHeader";
import { TableEmpty } from "@/components/tables/TableEmpty";
import { TableFooter } from "@/components/tables/TableFooter";

export function LeadTable() {
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
  {mockLeads.length === 0 ? (
    <TableEmpty message="No leads found." />
  ) : (
    mockLeads.map(lead => (
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
import { Lead } from "../types";
import { Card } from "@/components/ui/card";
import { TableFooter } from "@/components/tables/TableFooter";
import { LeadTableHeader } from "./LeadTableHeader";
import { LeadTableBody } from "./LeadTableBody";

interface LeadTableProps {
    leads: Lead[];
}

export function LeadTable({
    leads,
}: LeadTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl">
      <table className="w-full">
        <LeadTableHeader />

<LeadTableBody
    leads={leads}
/>
      </table>
      <TableFooter />
    </Card>
  );
}
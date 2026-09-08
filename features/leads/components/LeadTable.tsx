import { Lead } from "../types";
import { Card } from "@/components/ui/card";
import { TableFooter } from "@/components/tables/TableFooter";
import { LeadTableHeader } from "./LeadTableHeader";
import { LeadTableBody } from "./LeadTableBody";

interface LeadTableProps {
  leads: Lead[];
  onEdit?: (
    id: string,
    data: Partial<Lead>
  ) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function LeadTable({
  leads,
  onEdit,
  onDelete,
}: LeadTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl">
      <table className="w-full">

        <LeadTableHeader />

        <LeadTableBody
          leads={leads}
          onEdit={onEdit}
          onDelete={onDelete}
        />

      </table>

      <TableFooter />
    </Card>
  );
} 
import { Lead } from "../types";

import { Card } from "@/components/ui/card";
import { TableFooter } from "@/components/tables/TableFooter";

import { LeadTableHeader } from "./LeadTableHeader";
import { LeadTableBody } from "./LeadTableBody";

interface LeadTableProps {
  leads: Lead[];

  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;

  onPageChange: (page: number) => void;

  onEdit?: (
    id: string,
    data: Partial<Lead>
  ) => Promise<void>;

  onDelete?: (
    id: string
  ) => Promise<void>;
}

export function LeadTable({
  leads,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
}: LeadTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] table-fixed">
          <colgroup>
            <col className="w-[17%]" />
            <col className="w-[22%]" />
            <col className="w-[11%]" />
            <col className="w-[11%]" />
            <col className="w-[12%]" />
            <col className="w-[11%]" />
            <col className="w-[12%]" />
            <col className="w-[4%]" />
          </colgroup>

          <LeadTableHeader />

          <LeadTableBody
            leads={leads}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </table>
      </div>

      <TableFooter
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </Card>
  );
}
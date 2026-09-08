import { Lead } from "../types";
import { StatusBadge } from "./StatusBadge";
import { SourceBadge } from "./SourceBadge";
import { LeadDrawer } from "./LeadDrawer";

interface LeadRowProps {
  lead: Lead;
  onEdit?: (
    id: string,
    data: Partial<Lead>
  ) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function LeadRow({
  lead,
  onEdit,
  onDelete,
}: LeadRowProps) {
  return (
    <LeadDrawer
      lead={lead}
      onEdit={onEdit}
      onDelete={onDelete}
    >
      <tr className="cursor-pointer transition-colors hover:bg-slate-50">

        <td className="px-4 py-4 font-medium">
          {lead.clientName}
        </td>

        <td>{lead.eventType}</td>

        <td>{lead.eventDate}</td>

        <td>{lead.budget}</td>

        <td>
          <StatusBadge status={lead.status} />
        </td>

        <td>
          <SourceBadge source={lead.source} />
        </td>

        <td>{lead.assignedTo}</td>

      </tr>
    </LeadDrawer>
  );
}
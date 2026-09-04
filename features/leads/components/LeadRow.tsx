import { Lead } from "../types";
import { StatusBadge } from "./StatusBadge";
import { SourceBadge } from "./SourceBadge";
import { LeadDrawer } from "./LeadDrawer";

interface LeadRowProps {
  lead: Lead;
  onUpdateLead: (
    id: string,
    data: Partial<Lead>
  ) => Promise<Lead>;
}

export function LeadRow({
  lead,
  onUpdateLead,
}: LeadRowProps) {
  return (
    <LeadDrawer
      lead={lead}
      onUpdateLead={onUpdateLead}
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
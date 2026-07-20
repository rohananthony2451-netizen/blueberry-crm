import { Lead } from "../types";
import { StatusBadge } from "./StatusBadge";
import { SourceBadge } from "./SourceBadge";

interface LeadRowProps {
  lead: Lead;
}

export function LeadRow({ lead }: LeadRowProps) {
  return (
    <tr className="border-b">
      <td className="px-4 py-4 font-medium">{lead.clientName}</td>
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
  );
}
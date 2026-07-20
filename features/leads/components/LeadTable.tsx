import { Card } from "@/components/ui/card";

import { mockLeads } from "../data/mock-leads";
import { LeadRow } from "./LeadRow";

export function LeadTable() {
  return (
    <Card className="overflow-hidden rounded-2xl">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr className="text-left text-sm text-slate-600">
            <th className="px-4 py-3">Client</th>
            <th>Event</th>
            <th>Date</th>
            <th>Budget</th>
            <th>Status</th>
            <th>Source</th>
            <th>Assigned</th>
          </tr>
        </thead>

        <tbody>
          {mockLeads.map((lead) => (
            <LeadRow
              key={lead.id}
              lead={lead}
            />
          ))}
        </tbody>
      </table>
    </Card>
  );
}
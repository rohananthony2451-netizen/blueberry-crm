import { Lead } from "../types";

interface LeadDetailsProps {
  lead: Lead;
}

export function LeadDetails({
  lead,
}: LeadDetailsProps) {
  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-2xl font-bold">
          {lead.clientName}
        </h2>

        <p className="text-slate-500">
          {lead.phone}
        </p>
      </div>

      <div className="space-y-3">

        <Info
          label="Event"
          value={lead.eventType}
        />

        <Info
          label="Date"
          value={lead.eventDate}
        />

        <Info
          label="Budget"
          value={lead.budget}
        />

        <Info
          label="Source"
          value={lead.source}
        />

        <Info
          label="Assigned"
          value={lead.assignedTo}
        />

        <Info
          label="Status"
          value={lead.status}
        />

      </div>

    </div>
  );
}

interface InfoProps {
  label: string;
  value: string;
}

function Info({
  label,
  value,
}: InfoProps) {
  return (
    <div className="border-b pb-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-medium">
        {value}
      </p>
    </div>
  );
}
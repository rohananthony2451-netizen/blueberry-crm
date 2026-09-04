"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { Lead } from "../types";
import { LeadForm } from "./LeadForm";

interface LeadDetailsProps {
  lead: Lead;
  onUpdateLead: (
    id: string,
    data: Partial<Lead>
  ) => Promise<Lead>;
  onClose?: () => void;
}

export function LeadDetails({
  lead,
  onUpdateLead,
  onClose,
}: LeadDetailsProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  if (editing) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">
            Edit Lead
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Update the lead information.
          </p>
        </div>

        <LeadForm
          defaultValues={{
            clientName: lead.clientName,
            phone: lead.phone,
            eventType: lead.eventType,
            eventDate: lead.eventDate,
            budget: lead.budget.replace(/[₹,]/g, ""),
            source: lead.source,
            assignedTo: lead.assignedTo,
            notes: lead.notes,
          }}
          onCancel={() => setEditing(false)}
          saveText={
            saving ? "Saving..." : "Save Changes"
          }
          onSave={async (data) => {
            try {
              setSaving(true);

              await onUpdateLead(lead.id, {
                clientName: data.clientName,
                phone: data.phone,
                eventType: data.eventType,
                eventDate: data.eventDate,
                budget: data.budget,
                source: data.source as Lead["source"],
                assignedTo: data.assignedTo,
                notes: data.notes ?? "",
              });

              setEditing(false);
            } finally {
              setSaving(false);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {lead.clientName}
          </h2>

          <p className="text-slate-500">
            {lead.phone}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => setEditing(true)}
        >
          Edit Lead
        </Button>
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
          value={lead.assignedTo || "Unassigned"}
        />

        <Info
          label="Status"
          value={lead.status}
        />

        <Info
          label="Notes"
          value={lead.notes || "No notes"}
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
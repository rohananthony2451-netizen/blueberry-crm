"use client";

import { useState } from "react";

import { Lead } from "../types";
import { StatusBadge } from "./StatusBadge";
import { SourceBadge } from "./SourceBadge";
import { Button } from "@/components/ui/button";

interface LeadDetailsProps {
  lead: Lead;
  onEdit?: () => void;
  onDelete?: (id: string) => Promise<void>;
}

export function LeadDetails({
  lead,
  onEdit,
  onDelete,
}: LeadDetailsProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!onDelete) return;

    setDeleting(true);

    try {
      await onDelete(lead.id);
    } finally {
      setDeleting(false);
    }
  }

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

        <div className="border-b pb-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Source
          </p>

          <div className="mt-1">
            <SourceBadge source={lead.source} />
          </div>
        </div>

        <Info
          label="Assigned"
          value={lead.assignedTo || "Not assigned"}
        />

        <div className="border-b pb-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Status
          </p>

          <div className="mt-1">
            <StatusBadge status={lead.status} />
          </div>
        </div>

        <Info
          label="Notes"
          value={lead.notes || "No notes added."}
        />

      </div>

      {!confirmDelete ? (
        <div className="flex justify-end gap-3 border-t pt-6">

          <Button
            type="button"
            variant="outline"
            onClick={onEdit}
          >
            Edit Lead
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={() => setConfirmDelete(true)}
          >
            Delete Lead
          </Button>

        </div>
      ) : (
        <div className="space-y-4 rounded-xl border border-red-200 bg-red-50 p-4">

          <div>
            <p className="font-semibold text-red-900">
              Delete this lead?
            </p>

            <p className="mt-1 text-sm text-red-700">
              This action cannot be undone. The lead will be
              permanently removed from your workspace.
            </p>
          </div>

          <div className="flex justify-end gap-3">

            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmDelete(false)}
              disabled={deleting}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting
                ? "Deleting..."
                : "Yes, Delete Lead"}
            </Button>

          </div>

        </div>
      )}

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
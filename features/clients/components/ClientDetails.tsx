"use client";

import { useState } from "react";

import { Client } from "../types";
import { Button } from "@/components/ui/button";

interface ClientDetailsProps {
  client: Client;
  onEdit?: () => void;
  onDelete?: (id: string) => Promise<void>;
}

export function ClientDetails({
  client,
  onEdit,
  onDelete,
}: ClientDetailsProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!onDelete) return;

    setDeleting(true);

    try {
      await onDelete(client.id);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-2xl font-bold">
          {client.name}
        </h2>

        <p className="text-slate-500">
          {client.phone || "No phone number"}
        </p>
      </div>

      <div className="space-y-3">

        <Info
          label="Email"
          value={client.email || "No email added"}
        />

        <Info
          label="Address"
          value={client.address || "No address added"}
        />

        <Info
          label="Notes"
          value={client.notes || "No notes added"}
        />

      </div>

      {!confirmDelete ? (
        <div className="flex justify-end gap-3 border-t pt-6">

          <Button
            type="button"
            onClick={onEdit}
          >
            Edit Client
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={() => setConfirmDelete(true)}
          >
            Delete Client
          </Button>

        </div>
      ) : (
        <div className="space-y-4 rounded-xl border border-red-200 bg-red-50 p-4">

          <div>
            <p className="font-semibold text-red-900">
              Delete this client?
            </p>

            <p className="mt-1 text-sm text-red-700">
              This action cannot be undone. The client will be
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
                : "Yes, Delete Client"}
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
"use client";

import { Button } from "@/components/ui/button";

import { Client } from "../types";

interface ClientDetailsProps {
  client: Client;
  onEdit?: () => void;
}

export function ClientDetails({
  client,
  onEdit,
}: ClientDetailsProps) {
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
          value={client.email || "No email added."}
        />

        <Info
          label="Phone"
          value={client.phone || "No phone number added."}
        />

        <Info
          label="Address"
          value={client.address || "No address added."}
        />

        <Info
          label="Notes"
          value={client.notes || "No notes added."}
        />

      </div>

      <div className="flex justify-end border-t pt-6">
        <Button
          type="button"
          onClick={onEdit}
        >
          Edit Client
        </Button>
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
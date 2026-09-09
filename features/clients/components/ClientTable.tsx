"use client";

import { Card } from "@/components/ui/card";

import { Client } from "../types";
import { ClientTableHeader } from "./ClientTableHeader";
import { ClientTableBody } from "./ClientTableBody";

interface ClientTableProps {
  clients: Client[];

  onEdit?: (
    id: string,
    data: Partial<Client>
  ) => Promise<void>;

  onDelete?: (
    id: string
  ) => Promise<void>;
}

export function ClientTable({
  clients,
  onEdit,
  onDelete,
}: ClientTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl">
      <table className="w-full">
        <ClientTableHeader />

        <ClientTableBody
          clients={clients}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </table>
    </Card>
  );
}
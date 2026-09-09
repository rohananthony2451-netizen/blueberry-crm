"use client";

import { Client } from "../types";
import { ClientRow } from "./ClientRow";
import { TableEmpty } from "@/components/tables/TableEmpty";

interface ClientTableBodyProps {
  clients: Client[];

  onEdit?: (
    id: string,
    data: Partial<Client>
  ) => Promise<void>;

  onDelete?: (
    id: string
  ) => Promise<void>;
}

export function ClientTableBody({
  clients,
  onEdit,
  onDelete,
}: ClientTableBodyProps) {
  return (
    <tbody>
      {clients.length === 0 ? (
        <TableEmpty message="No clients found." />
      ) : (
        clients.map((client) => (
          <ClientRow
            key={client.id}
            client={client}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </tbody>
  );
}
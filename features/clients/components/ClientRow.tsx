"use client";

import { Client } from "../types";
import { ClientDrawer } from "./ClientDrawer";

interface ClientRowProps {
  client: Client;
  onEdit?: (
    id: string,
    data: Partial<Client>
  ) => Promise<unknown>;
}

export function ClientRow({
  client,
  onEdit,
}: ClientRowProps) {
  return (
    <ClientDrawer
      client={client}
      onEdit={onEdit}
    >
      <tr className="cursor-pointer border-t transition-colors hover:bg-slate-50">

        <td className="px-4 py-4 font-medium">
          {client.name}
        </td>

        <td className="px-4 py-4">
          {client.phone || "—"}
        </td>

        <td className="px-4 py-4">
          {client.email || "—"}
        </td>

        <td className="px-4 py-4">
          {client.address || "—"}
        </td>

      </tr>
    </ClientDrawer>
  );
}
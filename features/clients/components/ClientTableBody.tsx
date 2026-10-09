
"use client";

import type { Client } from "../types";
import type { Event } from "@/features/events/types";
import type { PendingPaymentItem } from "@/features/payments/types";

import { ClientRow } from "./ClientRow";
import { TableEmpty } from "@/components/tables/TableEmpty";

interface ClientTableBodyProps {
  clients: Client[];
  events: Event[];
  pendingPayments: PendingPaymentItem[];

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
  events,
  pendingPayments,
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
            events={events.filter(
              (event) => event.clientId === client.id
            )}
            pendingPayments={pendingPayments.filter(
              (payment) => payment.clientId === client.id
            )}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </tbody>
  );
}

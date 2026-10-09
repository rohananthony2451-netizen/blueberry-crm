
"use client";

import { Card } from "@/components/ui/card";

import type { Client } from "../types";
import type { Event } from "@/features/events/types";
import type { PendingPaymentItem } from "@/features/payments/types";

import { ClientTableHeader } from "./ClientTableHeader";
import { ClientTableBody } from "./ClientTableBody";

interface ClientTableProps {
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

export function ClientTable({
  clients,
  events,
  pendingPayments,
  onEdit,
  onDelete,
}: ClientTableProps) {
  return (
    <Card className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-none">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] table-fixed">
          <ClientTableHeader />

          <ClientTableBody
            clients={clients}
            events={events}
            pendingPayments={pendingPayments}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </table>
      </div>
    </Card>
  );
}

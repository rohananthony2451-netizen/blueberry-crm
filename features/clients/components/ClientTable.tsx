"use client";

import { useMemo, useState } from "react";

import type { Client } from "../types";
import type { Event } from "@/features/events/types";
import type { PendingPaymentItem } from "@/features/payments/types";

import { ClientTableHeader } from "./ClientTableHeader";
import type { ClientSortKey } from "./ClientTableHeader";
import { ClientTableBody } from "./ClientTableBody";

interface ClientTableProps {
  clients: Client[];
  events: Event[];
  pendingPayments: PendingPaymentItem[];
  canDelete: boolean;

  onEdit?: (
    id: string,
    data: Partial<Client>
  ) => Promise<void>;

  onDelete?: (id: string) => Promise<void>;
}

function getNextUpcomingEvent(events: Event[]): Event | undefined {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return events
    .filter((event) => {
      if (event.status === "Cancelled" || !event.eventDate) {
        return false;
      }

      const [year, month, day] = event.eventDate
        .slice(0, 10)
        .split("-")
        .map(Number);

      if (!year || !month || !day) return false;

      const eventDate = new Date(year, month - 1, day);

      return eventDate >= today;
    })
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate))[0];
}

function getOutstanding(
  clientId: string,
  pendingPayments: PendingPaymentItem[]
) {
  return pendingPayments
    .filter((payment) => payment.clientId === clientId)
    .reduce(
      (total, payment) => total + payment.remainingAmount,
      0
    );
}

export function ClientTable({
  clients,
  events,
  pendingPayments,
  canDelete,
  onEdit,
  onDelete,
}: ClientTableProps) {
  const [sortBy, setSortBy] = useState<ClientSortKey | null>(null);
  const [sortDirection, setSortDirection] =
    useState<"asc" | "desc">("asc");

  function handleSort(key: ClientSortKey) {
    if (sortBy === key) {
      setSortDirection((current) =>
        current === "asc" ? "desc" : "asc"
      );
    } else {
      setSortBy(key);
      setSortDirection("asc");
    }
  }

  const sortedClients = useMemo(() => {
    if (!sortBy) return clients;

    const direction = sortDirection === "asc" ? 1 : -1;

    return [...clients].sort((a, b) => {
      const aNextEvent = getNextUpcomingEvent(
        events.filter((event) => event.clientId === a.id)
      );

      const bNextEvent = getNextUpcomingEvent(
        events.filter((event) => event.clientId === b.id)
      );

      let aValue: string | number | null;
      let bValue: string | number | null;

      switch (sortBy) {
        case "name":
          aValue = a.name.trim().toLowerCase();
          bValue = b.name.trim().toLowerCase();
          break;

        case "venue":
          aValue = aNextEvent?.venue?.trim().toLowerCase() || null;
          bValue = bNextEvent?.venue?.trim().toLowerCase() || null;
          break;

        case "eventType":
          aValue = aNextEvent?.eventType?.trim().toLowerCase() || null;
          bValue = bNextEvent?.eventType?.trim().toLowerCase() || null;
          break;

        case "outstanding":
          aValue = getOutstanding(a.id, pendingPayments);
          bValue = getOutstanding(b.id, pendingPayments);
          break;

        case "nextEvent":
          aValue = aNextEvent?.eventDate || null;
          bValue = bNextEvent?.eventDate || null;
          break;
      }

      // Keep missing values at the bottom in either direction.
      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;

      if (
        typeof aValue === "number" &&
        typeof bValue === "number"
      ) {
        return (aValue - bValue) * direction;
      }

      return String(aValue).localeCompare(String(bValue)) * direction;
    });
  }, [
    clients,
    events,
    pendingPayments,
    sortBy,
    sortDirection,
  ]);

  return (
    <div className="overflow-hidden rounded-2xl border bg-background">
      <div className="overflow-x-auto">
      <table className="w-full min-w-[960px] table-fixed text-sm">       
        <ClientTableHeader
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={handleSort}
          />

          <ClientTableBody
            clients={sortedClients}
            events={events}
            pendingPayments={pendingPayments}
            canDelete={canDelete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </table>
      </div>
    </div>
  );
}
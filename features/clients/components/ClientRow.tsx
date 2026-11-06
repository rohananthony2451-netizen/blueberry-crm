
"use client";

import { CalendarDays, MapPin } from "lucide-react";

import type { Client } from "../types";
import type { Event } from "@/features/events/types";
import type { PendingPaymentItem } from "@/features/payments/types";

import { ClientDrawer } from "./ClientDrawer";

interface ClientRowProps {
  client: Client;
  events: Event[];
  pendingPayments: PendingPaymentItem[];
  canDelete: boolean;
  onEdit?: (id: string, data: Partial<Client>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatEventDate(date: string) {
  if (!date) return "—";

  const [year, month, day] = date.slice(0, 10).split("-").map(Number);

  if (!year || !month || !day) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function ClientRow({
  client,
  events,
  pendingPayments,
  canDelete,
  onEdit,
  onDelete,
}: ClientRowProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events
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
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate));

  const nextEvent = upcomingEvents[0];

  const outstanding = pendingPayments.reduce(
    (total, payment) => total + payment.remainingAmount,
    0
  );

  return (
    <ClientDrawer
      client={client}
      canDelete={canDelete}
      onEdit={onEdit}
      onDelete={onDelete}
    >
      <tr className="cursor-pointer border-t border-slate-100 transition-colors hover:bg-slate-50/70">
        <td className="px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-xs font-semibold text-blue-700">
              {getInitials(client.name)}
            </div>

            <div className="min-w-0">
              <div className="truncate text-sm font-medium leading-5 text-slate-950">
                {client.name}
              </div>
              <div className="mt-0.5 truncate text-xs leading-4 text-slate-500">
                {client.email || "—"}
              </div>
            </div>
          </div>
        </td>

        <td className="px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin size={15} className="shrink-0 text-slate-400" />
            <span className="truncate">{nextEvent?.venue || "—"}</span>
          </div>
        </td>

        <td className="px-4 py-4">
          {nextEvent?.eventType ? (
            <span className="inline-flex max-w-full truncate rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {nextEvent.eventType}
            </span>
          ) : (
            <span className="text-sm text-slate-400">—</span>
          )}
        </td>

        <td className="px-4 py-4">
          <span
            className={`whitespace-nowrap text-sm font-medium ${
              outstanding > 0 ? "text-slate-950" : "text-slate-500"
            }`}
          >
            {currencyFormatter.format(outstanding)}
          </span>
        </td>

        <td className="px-4 py-4">
          {nextEvent ? (
            <div className="flex items-center gap-2 whitespace-nowrap text-sm text-slate-600">
              <CalendarDays
                size={15}
                className="shrink-0 text-slate-400"
              />
              {formatEventDate(nextEvent.eventDate)}
            </div>
          ) : (
            <span className="text-sm text-slate-400">—</span>
          )}
        </td>
      </tr>
    </ClientDrawer>
  );
}

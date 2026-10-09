
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

  onEdit?: (
    id: string,
    data: Partial<Client>
  ) => Promise<void>;

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

export function ClientRow({
  client,
  events,
  pendingPayments,
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
      onEdit={onEdit}
      onDelete={onDelete}
    >
      <tr className="cursor-pointer border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/80">
        <td className="px-4 py-2.5">
          <div className="truncate text-[13px] font-semibold leading-5 text-slate-900">
            {client.name}
          </div>
          <div className="mt-0 truncate text-[11px] leading-4 text-slate-500">
            {client.email || "—"}
          </div>
        </td>

        <td className="px-4 py-2.5">
          <div className="flex items-center gap-1.5 text-[12px] text-slate-600">
            <MapPin
              size={14}
              className="shrink-0 text-slate-400"
            />
            <span className="truncate">
              {nextEvent?.venue || "—"}
            </span>
          </div>
        </td>

        <td className="px-4 py-2.5">
          {nextEvent?.eventType ? (
            <span className="inline-flex max-w-full truncate rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
              {nextEvent.eventType}
            </span>
          ) : (
            <span className="text-xs text-slate-400">—</span>
          )}
        </td>

        <td className="px-4 py-2.5">
          <span
            className={`whitespace-nowrap text-[13px] font-semibold ${
              outstanding > 0
                ? "text-slate-900"
                : "text-slate-500"
            }`}
          >
            {currencyFormatter.format(outstanding)}
          </span>
        </td>

        <td className="px-4 py-2.5">
          {nextEvent ? (
            <div className="flex items-center gap-1.5 whitespace-nowrap text-[12px] text-slate-600">
              <CalendarDays
                size={14}
                className="shrink-0 text-slate-400"
              />
              {formatEventDate(nextEvent.eventDate)}
            </div>
          ) : (
            <span className="text-xs text-slate-400">—</span>
          )}
        </td>
      </tr>
    </ClientDrawer>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
} from "lucide-react";

import type { Event } from "../types";
import { EventDrawer } from "./EventDrawer";
import { EventStatusBadge } from "./EventStatusBadge";
import { EventTypeBadge } from "./EventTypeBadge";
import {
  getEventFinancialSummary,
  type EventFinancialSummary,
} from "../services/eventFinancial.service";

interface EventRowProps {
  event: Event;
  onEdit?: (
    id: string,
    data: Partial<Event>
  ) => Promise<void>;
  onDelete?: (id: string) => void;
  onStatusChange?: (
    id: string,
    status: Event["status"]
  ) => Promise<void>;
}

const EMPTY_FINANCIALS: EventFinancialSummary = {
  quotationCount: 0,
  quotationTotal: 0,
  paymentsReceived: 0,
  customerBalance: 0,
  obligationCount: 0,
  obligationsTotal: 0,
  obligationsPaid: 0,
  obligationsRemaining: 0,
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(`${value.slice(0, 10)}T00:00:00`);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function EventRow({
  event,
  onEdit,
  onDelete,
  onStatusChange,
}: EventRowProps) {
  const [financials, setFinancials] =
    useState<EventFinancialSummary | null>(null);

  useEffect(() => {
    let active = true;

    async function loadFinancials() {
      try {
        const result = await getEventFinancialSummary(event.id);

        if (active) setFinancials(result);
      } catch {
        if (active) setFinancials(EMPTY_FINANCIALS);
      }
    }

    void loadFinancials();

    return () => {
      active = false;
    };
  }, [event.id]);

  return (
    <EventDrawer
      event={event}
      onEdit={onEdit}
      onDelete={onDelete}
      onStatusChange={onStatusChange}
    >
      <tr className="cursor-pointer border-t border-slate-100 text-sm transition-colors hover:bg-blue-50/40">
        <td className="px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarDays size={17} />
            </span>
            <span className="min-w-0 truncate font-medium text-slate-900">
              {event.eventName}
            </span>
          </div>
        </td>

        <td className="truncate px-4 py-3 text-slate-600">
          {event.clientName || "—"}
        </td>

        <td className="px-4 py-3">
          <div className="flex min-w-0 items-center gap-1.5 text-slate-600">
            <MapPin size={14} className="shrink-0 text-slate-400" />
            <span className="truncate">{event.venue || "—"}</span>
          </div>
        </td>

        <td className="whitespace-nowrap px-4 py-3 text-slate-600">
          {formatDate(event.eventDate)}
        </td>

        <td className="px-4 py-3">
          <EventTypeBadge type={event.eventType} />
        </td>

        <td className="px-4 py-3">
          <EventStatusBadge status={event.status} />
        </td>

        <td className="px-4 py-3">
          {financials ? (
            <div className="space-y-0.5">
              <p className="whitespace-nowrap font-semibold text-slate-900">
                {formatCurrency(financials.quotationTotal)}
              </p>
              {financials.quotationTotal > 0 && (
                <p
                  className={`whitespace-nowrap text-xs ${
                    financials.customerBalance > 0
                      ? "text-amber-600"
                      : "text-emerald-600"
                  }`}
                >
                  {financials.customerBalance > 0
                    ? `Bal. ${formatCurrency(financials.customerBalance)}`
                    : "Fully paid"}
                </p>
              )}
            </div>
          ) : (
            <span className="text-slate-400">Loading…</span>
          )}
        </td>
      </tr>
    </EventDrawer>
  );
}
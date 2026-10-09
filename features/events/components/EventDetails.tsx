
"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  FileText,
  MapPin,
  RotateCcw,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Event } from "../types";
import {
  getEventFinancialSummary,
  type EventFinancialSummary,
} from "../services/eventFinancial.service";

import { EventStatusBadge } from "./EventStatusBadge";
import { EventTypeBadge } from "./EventTypeBadge";

interface EventDetailsProps {
  event: Event;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (
    status: Event["status"]
  ) => Promise<void>;
  statusUpdating?: boolean;
}

const EMPTY_SUMMARY: EventFinancialSummary = {
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

function DetailLine({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 text-sm text-slate-600">
      <span className="mt-0.5 shrink-0 text-slate-400">
        {icon}
      </span>
      <span className="min-w-0 break-words">{children}</span>
    </div>
  );
}

export function EventDetails({
  event,
  onEdit,
  onDelete,
  onStatusChange,
  statusUpdating = false,
}: EventDetailsProps) {
  const [summary, setSummary] =
    useState<EventFinancialSummary>(EMPTY_SUMMARY);
  const [financialLoading, setFinancialLoading] =
    useState(true);
  const [financialError, setFinancialError] =
    useState(false);

  useEffect(() => {
    let active = true;

    async function loadSummary() {
      setFinancialLoading(true);
      setFinancialError(false);

      try {
        const result =
          await getEventFinancialSummary(event.id);

        if (active) setSummary(result);
      } catch {
        if (active) setFinancialError(true);
      } finally {
        if (active) setFinancialLoading(false);
      }
    }

    void loadSummary();

    return () => {
      active = false;
    };
  }, [event.id]);

  async function handleStatusChange(
    status: Event["status"]
  ) {
    if (!onStatusChange) return;
    await onStatusChange(status);
  }

  return (
    <div className="space-y-6 p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <CalendarDays size={26} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            {event.eventName}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {event.clientName}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <EventStatusBadge status={event.status} />
            <EventTypeBadge type={event.eventType} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <section className="rounded-2xl bg-slate-50 p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Event Details
          </h3>

          <div className="space-y-3.5">
            <DetailLine icon={<CalendarDays size={16} />}>
              {formatDate(event.eventDate)}
            </DetailLine>

            <DetailLine icon={<MapPin size={16} />}>
              {event.venue || "Venue not specified"}
            </DetailLine>

            <DetailLine icon={<Users size={16} />}>
              {event.guestCount.toLocaleString("en-IN")} guests
            </DetailLine>

            <DetailLine icon={<FileText size={16} />}>
              Event reference: {event.id.slice(0, 8)}
            </DetailLine>
          </div>
        </section>

        <section className="rounded-2xl bg-slate-50 p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Payment Summary
          </h3>

          {financialLoading ? (
            <p className="text-sm text-slate-500">
              Loading financial summary...
            </p>
          ) : financialError ? (
            <p className="text-sm text-red-600">
              Financial information could not be loaded.
            </p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">Total Value</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(summary.quotationTotal)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">Received</span>
                <span className="font-semibold text-emerald-600">
                  {formatCurrency(summary.paymentsReceived)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-3 text-sm">
                <span className="text-slate-500">Balance</span>
                <span className="font-semibold text-amber-600">
                  {formatCurrency(summary.customerBalance)}
                </span>
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-800">
          Money Going Out
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Vendor and expense obligations linked to this event.
        </p>

        {financialLoading ? (
          <p className="mt-3 text-sm text-slate-500">
            Loading expense information...
          </p>
        ) : financialError ? (
          <p className="mt-3 text-sm text-slate-500">
            Expense information is unavailable.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Total Obligations</p>
              <p className="mt-1 font-semibold text-slate-900">
                {formatCurrency(summary.obligationsTotal)}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Already Paid</p>
              <p className="mt-1 font-semibold text-emerald-600">
                {formatCurrency(summary.obligationsPaid)}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Still to Pay</p>
              <p className="mt-1 font-semibold text-amber-600">
                {formatCurrency(summary.obligationsRemaining)}
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-800">
          Booking Controls
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Change the booking status when circumstances change.
          Status transitions follow the existing workflow rules.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {event.status !== "Cancelled" ? (
            <Button
              type="button"
              variant="outline"
              disabled={statusUpdating || !onStatusChange}
              onClick={() =>
                void handleStatusChange("Cancelled")
              }
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <X size={15} />
              {statusUpdating ? "Updating..." : "Cancel Event"}
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              disabled={statusUpdating || !onStatusChange}
              onClick={() =>
                void handleStatusChange("Upcoming")
              }
            >
              <RotateCcw size={15} />
              {statusUpdating ? "Updating..." : "Reopen Event"}
            </Button>
          )}
        </div>
      </section>

      <div className="flex flex-col-reverse justify-between gap-3 border-t border-slate-200 pt-5 sm:flex-row">
        <Button
          type="button"
          variant="destructive"
          onClick={onDelete}
        >
          Delete Event
        </Button>

        <Button type="button" onClick={onEdit}>
          Edit Event
        </Button>
      </div>
    </div>
  );
}

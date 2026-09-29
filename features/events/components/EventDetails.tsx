"use client";

import {
  RotateCcw,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Event } from "../types";

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

export function EventDetails({
  event,
  onEdit,
  onDelete,
  onStatusChange,
  statusUpdating = false,
}: EventDetailsProps) {
  async function handleStatusChange(
    status: Event["status"]
  ) {
    if (!onStatusChange) return;
    await onStatusChange(status);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          {event.eventName}
        </h2>

        <p className="mt-1 text-slate-500">
          {event.clientName}
        </p>
      </div>

      <div className="space-y-3">
        <div className="border-b pb-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Event Type
          </p>

          <div className="mt-1">
            <EventTypeBadge type={event.eventType} />
          </div>
        </div>

        <Info
          label="Event Date"
          value={event.eventDate}
        />

        <Info
          label="Venue"
          value={event.venue}
        />

        <Info
          label="Guest Count"
          value={event.guestCount.toString()}
        />

        <div className="border-b pb-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Status
          </p>

          <div className="mt-1">
            <EventStatusBadge status={event.status} />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Status is determined automatically by the
            event date. Cancelled events remain cancelled.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border bg-slate-50/70 p-4">
        <p className="text-sm font-semibold">
          Booking Controls
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Accepting a quotation confirms the booking.
          You do not need to start the event manually.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {event.status !== "Cancelled" && (
            <Button
              type="button"
              variant="outline"
              disabled={
                statusUpdating || !onStatusChange
              }
              onClick={() =>
                void handleStatusChange("Cancelled")
              }
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <X size={15} />
              {statusUpdating
                ? "Updating..."
                : "Cancel Event"}
            </Button>
          )}

          {event.status === "Cancelled" && (
            <Button
              type="button"
              variant="outline"
              disabled={
                statusUpdating || !onStatusChange
              }
              onClick={() =>
                void handleStatusChange(
                  "Upcoming"
                )
              }
            >
              <RotateCcw size={15} />
              {statusUpdating
                ? "Updating..."
                : "Reopen Event"}
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-between border-t pt-6">
        <Button
          type="button"
          variant="destructive"
          onClick={onDelete}
        >
          Delete Event
        </Button>

        <Button
          type="button"
          onClick={onEdit}
        >
          Edit Event
        </Button>
      </div>
    </div>
  );
}

interface InfoProps {
  label: string;
  value: string;
}

function Info({
  label,
  value,
}: InfoProps) {
  return (
    <div className="border-b pb-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-medium">
        {value}
      </p>
    </div>
  );
}
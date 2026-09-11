import { Event } from "../types";
import { EventStatusBadge } from "./EventStatusBadge";
import { EventTypeBadge } from "./EventTypeBadge";
import { Button } from "@/components/ui/button";

interface EventDetailsProps {
  event: Event;
  onEdit?: () => void;
}

export function EventDetails({
  event,
  onEdit,
}: EventDetailsProps) {
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
        </div>

      </div>

      <div className="flex justify-end border-t pt-6">
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
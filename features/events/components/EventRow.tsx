import { Event } from "../types";
import { EventDrawer } from "./EventDrawer";
import { EventStatusBadge } from "./EventStatusBadge";
import { EventTypeBadge } from "./EventTypeBadge";

interface EventRowProps {
  event: Event;

  onEdit?: (
    id: string,
    data: Partial<Event>
  ) => void;

  onDelete?: (id: string) => void;
}

export function EventRow({
  event,
  onEdit,
  onDelete,
}: EventRowProps) {
  return (
    <EventDrawer
      event={event}
      onEdit={onEdit}
      onDelete={onDelete}
    >
      <tr className="cursor-pointer border-t transition-colors hover:bg-slate-50">

        <td className="px-4 py-4 font-medium">
          {event.eventName}
        </td>

        <td className="px-4 py-4">
          {event.clientName}
        </td>

        <td className="px-4 py-4">
          <EventTypeBadge type={event.eventType} />
        </td>

        <td className="px-4 py-4">
          {event.eventDate}
        </td>

        <td className="px-4 py-4">
          {event.venue}
        </td>

        <td className="px-4 py-4">
          {event.guestCount}
        </td>

        <td className="px-4 py-4">
          <EventStatusBadge status={event.status} />
        </td>

      </tr>
    </EventDrawer>
  );
}
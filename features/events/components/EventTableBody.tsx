import { Event } from "../types";
import { EventRow } from "./EventRow";

interface EventTableBodyProps {
  events: Event[];
  canDelete: boolean;

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

export function EventTableBody({
  events,
  onEdit,
  onDelete,
  canDelete,
  onStatusChange,
}: EventTableBodyProps) {
  if (events.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={7}
            className="px-6 py-12 text-center text-sm text-slate-500"
          >
            No events found.
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {events.map((event) => (
        <EventRow
          key={event.id}
          event={event}
          onEdit={onEdit}
          onDelete={onDelete}
          canDelete={canDelete}
          onStatusChange={
            onStatusChange
          }
        />
      ))}
    </tbody>
  );
}
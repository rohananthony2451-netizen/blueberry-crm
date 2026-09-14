import { Event } from "../types";
import { EventRow } from "./EventRow";
import { TableEmpty } from "@/components/tables/TableEmpty";

interface EventTableBodyProps {
  events: Event[];

  onEdit?: (
    id: string,
    data: Partial<Event>
  ) => Promise<void>;

  onDelete?: (id: string) => void;
}

export function EventTableBody({
  events,
  onEdit,
  onDelete,
}: EventTableBodyProps) {
  return (
    <tbody>
      {events.length === 0 ? (
        <TableEmpty message="No events found." />
      ) : (
        events.map((event) => (
          <EventRow
            key={event.id}
            event={event}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </tbody>
  );
}
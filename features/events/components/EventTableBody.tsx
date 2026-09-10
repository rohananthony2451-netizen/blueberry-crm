import { Event } from "../types";
import { EventRow } from "./EventRow";
import { TableEmpty } from "@/components/tables/TableEmpty";

interface EventTableBodyProps {
  events: Event[];
}

export function EventTableBody({
  events,
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
          />
        ))
      )}
    </tbody>
  );
}
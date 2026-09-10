import { Card } from "@/components/ui/card";

import { Event } from "../types";
import { EventTableHeader } from "./EventTableHeader";
import { EventTableBody } from "./EventTableBody";

interface EventTableProps {
  events: Event[];
}

export function EventTable({
  events,
}: EventTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <EventTableHeader />

          <EventTableBody
            events={events}
          />
        </table>
      </div>
    </Card>
  );
}
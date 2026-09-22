import { Card } from "@/components/ui/card";

import { Event } from "../types";
import { EventTableHeader } from "./EventTableHeader";
import { EventTableBody } from "./EventTableBody";

interface EventTableProps {
  events: Event[];

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

export function EventTable({
  events,
  onEdit,
  onDelete,
  onStatusChange,
}: EventTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <EventTableHeader />

          <EventTableBody
            events={events}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={
              onStatusChange
            }
          />
        </table>
      </div>
    </Card>
  );
}
import { Card } from "@/components/ui/card";

import { Event } from "../types";
import { EventTableHeader } from "./EventTableHeader";
import { EventTableBody } from "./EventTableBody";

interface EventTableProps {
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

export function EventTable({
  events,
  onEdit,
  onDelete,
  canDelete,
  onStatusChange,
}: EventTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[960px] table-fixed">
          <EventTableHeader />
          <EventTableBody
            events={events}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            canDelete={canDelete}
          />
        </table>
      </div>
    </Card>
  );
}

import { Card } from "@/components/ui/card";
import type { Event } from "@/features/events/types";

export function UpcomingEvents({
  events,
}: {
  events: Event[];
}) {
  return (
    <Card className="rounded-2xl p-6">
      <h3 className="mb-5 text-lg font-semibold">
        Upcoming Events
      </h3>

      {events.length === 0 ? (
        <p className="py-6 text-sm text-slate-500">
          No upcoming events scheduled.
        </p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border p-4"
            >
              <h4 className="font-semibold">{event.eventName}</h4>
              <p className="text-sm text-slate-500">
                {event.clientName}
                {event.venue ? ` · ${event.venue}` : ""}
              </p>
              <p className="mt-2 text-xs text-blue-600">
                {new Date(
                  `${event.eventDate}T00:00:00`
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

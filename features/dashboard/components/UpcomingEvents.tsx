import { Card } from "@/components/ui/card";
import { upcomingEvents } from "../data/mock-dashboard";

export function UpcomingEvents() {
  return (
    <Card className="rounded-2xl p-6">
      <h3 className="mb-5 text-lg font-semibold">
        Upcoming Events
      </h3>

      <div className="space-y-4">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="rounded-xl border p-4"
          >
            <h4 className="font-semibold">
              {event.name}
            </h4>

            <p className="text-sm text-slate-500">
              {event.venue}
            </p>

            <p className="text-xs text-blue-600">
              {event.date}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
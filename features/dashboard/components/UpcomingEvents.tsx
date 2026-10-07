import {
  ArrowRight,
  CalendarDays,
  MapPin,
} from "lucide-react";

import type { Event } from "@/features/events/types";

function formatEventDate(date: string) {
  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

export function UpcomingEvents({
  events,
}: {
  events: Event[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            Schedule
          </p>

          <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
            Upcoming events
          </h3>
        </div>

        <button
          type="button"
          className="group flex items-center gap-1 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {events.length === 0 ? (
        <div className="py-10 text-center">
          <CalendarDays className="mx-auto h-8 w-8 text-slate-300" />

          <p className="mt-3 text-sm font-medium text-slate-700">
            No upcoming events
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Your next events will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-5 divide-y divide-slate-100">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0"
            >
              <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-50">
                <span className="text-[10px] font-semibold uppercase text-slate-400">
                  {new Date(
                    `${event.eventDate}T00:00:00`
                  ).toLocaleDateString("en-IN", {
                    month: "short",
                  })}
                </span>

                <span className="text-sm font-bold text-slate-900">
                  {new Date(
                    `${event.eventDate}T00:00:00`
                  ).getDate()}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {event.eventName}
                </p>

                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {event.clientName}
                </p>

                {event.venue && (
                  <div className="mt-1 flex min-w-0 items-center gap-1 text-xs text-slate-400">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">
                      {event.venue}
                    </span>
                  </div>
                )}
              </div>

              <span className="hidden shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600 sm:block">
                {event.eventType}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
"use client";

import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

import type { Event } from "@/features/events/types";

const COLORS = [
  "#2563eb",
  "#7c3aed",
  "#0f766e",
  "#ea580c",
  "#db2777",
  "#0891b2",
  "#ca8a04",
];

export function EventTypeChart({
  events,
}: {
  events: Event[];
}) {
  const counts = new Map<string, number>();

  for (const event of events) {
    if (event.status === "Cancelled") {
      continue;
    }

    const type = event.eventType.trim() || "Unspecified";

    counts.set(
      type,
      (counts.get(type) ?? 0) + 1
    );
  }

  const data = Array.from(
    counts,
    ([name, value]) => ({
      name,
      value,
    })
  ).sort((a, b) => b.value - a.value);

  const totalEvents = data.reduce(
    (total, item) => total + item.value,
    0
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
          Event mix
        </p>

        <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
          Events by type
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Active and completed events
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-[280px] items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-medium text-slate-700">
              No event data yet
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Your event distribution will appear here.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="relative mt-2 h-[185px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={78}
                  paddingAngle={3}
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={
                        COLORS[index % COLORS.length]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    boxShadow:
                      "0 10px 30px rgba(15, 23, 42, 0.08)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold tracking-tight text-slate-950">
                  {totalEvents}
                </p>

                <p className="text-[11px] font-medium text-slate-400">
                  total events
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2 space-y-2">
            {data.slice(0, 5).map((item, index) => {
              const percentage =
                totalEvents > 0
                  ? Math.round(
                      (item.value / totalEvents) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          COLORS[
                            index % COLORS.length
                          ],
                      }}
                    />

                    <span className="truncate text-sm font-medium text-slate-700">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      {item.value}
                    </span>

                    <span className="w-9 text-right text-xs text-slate-400">
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })}

            {data.length > 5 && (
              <p className="pt-1 text-xs font-medium text-slate-400">
                + {data.length - 5} more event types
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
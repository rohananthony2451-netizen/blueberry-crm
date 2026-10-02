
"use client";

import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

import { Card } from "@/components/ui/card";
import type { Event } from "@/features/events/types";

const COLORS = [
  "#2563eb",
  "#7c3aed",
  "#22c55e",
  "#f97316",
  "#ec4899",
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
    if (event.status === "Cancelled") continue;

    const type = event.eventType.trim() || "Unspecified";
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }

  const data = Array.from(counts, ([name, value]) => ({
    name,
    value,
  }));

  return (
    <Card className="rounded-2xl p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold">
        Events by Type
      </h3>

      {data.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center text-sm text-slate-500">
          No event records yet.
        </div>
      ) : (
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={105}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

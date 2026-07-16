"use client";

import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

import { Card } from "@/components/ui/card";
import { eventTypeData } from "../data/mock-dashboard";

const COLORS = [
  "#2563eb",
  "#7c3aed",
  "#22c55e",
  "#f97316",
  "#ec4899",
];

export function EventTypeChart() {
  return (
    <Card className="rounded-2xl p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold">
        Events by Type
      </h3>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={eventTypeData}
              dataKey="value"
              innerRadius={70}
              outerRadius={110}
            >
              {eventTypeData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
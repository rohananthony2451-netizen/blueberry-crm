"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import { revenueData } from "../data/mock-dashboard";

export function RevenueChart() {
  return (
    <Card className="rounded-2xl p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold">
        Monthly Revenue
      </h3>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Area
              dataKey="revenue"
              stroke="#2563eb"
              fill="#bfdbfe"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
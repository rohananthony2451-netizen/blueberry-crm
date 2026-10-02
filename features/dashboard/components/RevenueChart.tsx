
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
import type { Payment } from "@/features/payments/types";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function buildMonthlyData(payments: Payment[]) {
  const now = new Date();
  const months: { key: string; month: string; revenue: number }[] = [];

  for (let offset = 6; offset >= 0; offset--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - offset,
      1
    );

    const key = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    months.push({
      key,
      month: date.toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit",
      }),
      revenue: 0,
    });
  }

  const totals = new Map(months.map((month) => [month.key, 0]));

  for (const payment of payments) {
    const key = payment.paymentDate.slice(0, 7);

    if (totals.has(key)) {
      totals.set(key, (totals.get(key) ?? 0) + payment.amount);
    }
  }

  return months.map((month) => ({
    month: month.month,
    revenue: totals.get(month.key) ?? 0,
  }));
}

export function RevenueChart({
  payments,
}: {
  payments: Payment[];
}) {
  const data = buildMonthlyData(payments);

  return (
    <Card className="rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold">
        Monthly Payments Received
      </h3>
      <p className="mb-6 mt-1 text-sm text-slate-500">
        Based on recorded payment dates · Last 7 months
      </p>

      {payments.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center text-sm text-slate-500">
          No payment records yet.
        </div>
      ) : (
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={(value: number) =>
                  new Intl.NumberFormat("en-IN", {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  }).format(value)
                }
              />
              <Tooltip
                formatter={(value) => [
                  formatCurrency(Number(value)),
                  "Payments received",
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                fill="#bfdbfe"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

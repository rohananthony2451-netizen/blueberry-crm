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

import type { Payment } from "@/features/payments/types";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCompactCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

function buildMonthlyData(payments: Payment[]) {
  const now = new Date();

  const months: {
    key: string;
    month: string;
    revenue: number;
  }[] = [];

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
      }),
      revenue: 0,
    });
  }

  const totals = new Map(
    months.map((month) => [month.key, 0])
  );

  for (const payment of payments) {
    const key = payment.paymentDate.slice(0, 7);

    if (totals.has(key)) {
      totals.set(
        key,
        (totals.get(key) ?? 0) + payment.amount
      );
    }
  }

  return months.map((month) => ({
    month: month.month,
    revenue: totals.get(month.key) ?? 0,
  }));
}

function getTotalRevenue(data: { revenue: number }[]) {
  return data.reduce(
    (total, item) => total + item.revenue,
    0
  );
}

export function RevenueChart({
  payments,
}: {
  payments: Payment[];
}) {
  const data = buildMonthlyData(payments);
  const totalRevenue = getTotalRevenue(data);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            Revenue overview
          </p>

          <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
            Payments received
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Monthly collection performance
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs font-medium text-slate-400">
            Last 7 months
          </p>

          <p className="mt-1 text-lg font-bold tracking-tight text-slate-900">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="flex h-[280px] items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-medium text-slate-700">
              No payment activity yet
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Recorded payments will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-5 h-[285px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 8,
                left: -18,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="revenueFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#2563eb"
                    stopOpacity={0.18}
                  />
                  <stop
                    offset="100%"
                    stopColor="#2563eb"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#94a3b8",
                  fontSize: 11,
                }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#94a3b8",
                  fontSize: 11,
                }}
                tickFormatter={formatCompactCurrency}
                width={48}
              />

              <Tooltip
                cursor={{
                  stroke: "#cbd5e1",
                  strokeDasharray: "4 4",
                }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  boxShadow:
                    "0 10px 30px rgba(15, 23, 42, 0.08)",
                  padding: "10px 12px",
                }}
                labelStyle={{
                  color: "#64748b",
                  fontSize: 11,
                  marginBottom: 4,
                }}
                formatter={(value) => [
                  formatCurrency(Number(value)),
                  "Received",
                ]}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={2.5}
                fill="url(#revenueFill)"
                activeDot={{
                  r: 5,
                  strokeWidth: 3,
                  stroke: "#fff",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
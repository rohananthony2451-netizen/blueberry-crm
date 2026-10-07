import {
  CalendarDays,
  IndianRupee,
  ReceiptText,
  UserPlus,
} from "lucide-react";

import { KPIStat } from "./KPIStat";

interface DashboardStatsProps {
  totalRevenue: number;
  activeEvents: number;
  pendingPayments: number;
  newLeads: number;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function DashboardStats({
  totalRevenue,
  activeEvents,
  pendingPayments,
  newLeads,
}: DashboardStatsProps) {
  return (
    <section
      aria-label="Business overview"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <KPIStat
        title="Total Revenue"
        value={formatCurrency(totalRevenue)}
        subtitle="Collected payments"
        icon={IndianRupee}
        iconClassName="bg-blue-50 text-blue-600"
      />

      <KPIStat
        title="Active Events"
        value={String(activeEvents)}
        subtitle="Upcoming & in progress"
        icon={CalendarDays}
        iconClassName="bg-violet-50 text-violet-600"
      />

      <KPIStat
        title="Pending Payments"
        value={formatCurrency(pendingPayments)}
        subtitle="Outstanding amount"
        icon={ReceiptText}
        iconClassName="bg-amber-50 text-amber-600"
      />

      <KPIStat
        title="New Leads"
        value={String(newLeads)}
        subtitle="Leads in your pipeline"
        icon={UserPlus}
        iconClassName="bg-emerald-50 text-emerald-600"
      />
    </section>
  );
}
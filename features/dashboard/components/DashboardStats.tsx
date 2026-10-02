
import {
  Calendar,
  IndianRupee,
  Clock3,
  Users,
} from "lucide-react";

import { KPIStat } from "./KPIStat";

interface DashboardStatsProps {
  totalReceived: number;
  completedEvents: number;
  pendingAmount: number;
  totalClients: number;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function DashboardStats({
  totalReceived,
  completedEvents,
  pendingAmount,
  totalClients,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <KPIStat
        title="Payments Received"
        value={formatCurrency(totalReceived)}
        subtitle="All recorded payments"
        icon={IndianRupee}
      />

      <KPIStat
        title="Events Completed"
        value={String(completedEvents)}
        subtitle="Based on event status"
        icon={Calendar}
      />

      <KPIStat
        title="Outstanding Payments"
        value={formatCurrency(pendingAmount)}
        subtitle="From sent and accepted quotations"
        icon={Clock3}
      />

      <KPIStat
        title="Total Clients"
        value={String(totalClients)}
        subtitle="Registered clients"
        icon={Users}
      />
    </div>
  );
}

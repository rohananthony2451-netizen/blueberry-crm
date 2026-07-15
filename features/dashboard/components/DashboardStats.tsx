import {
  Calendar,
  IndianRupee,
  Users,
  TrendingUp,
} from "lucide-react";

import { StatCard } from "@/components/design-system/StatCard";

export function DashboardStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Revenue"
        value="₹18,40,000"
        icon={IndianRupee}
        change="+18%"
      />

      <StatCard
        title="Active Events"
        value="12"
        icon={Calendar}
        change="+2"
      />

      <StatCard
        title="Clients"
        value="84"
        icon={Users}
        change="+8"
      />

      <StatCard
        title="Profit"
        value="₹6,20,000"
        icon={TrendingUp}
        change="+14%"
      />
    </div>
  );
}
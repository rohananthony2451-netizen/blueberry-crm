import {
  Calendar,
  IndianRupee,
  Clock3,
  Users,
} from "lucide-react";

import { KPIStat } from "./KPIStat";

export function DashboardStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <KPIStat
        title="Annual Revenue"
        value="₹1.36 Cr"
        subtitle="+22% vs last year"
        icon={IndianRupee}
      />

      <KPIStat
        title="Events Completed"
        value="36"
        subtitle="2 cancelled"
        icon={Calendar}
      />

      <KPIStat
        title="Pending Payments"
        value="₹9.4 L"
        subtitle="5 overdue"
        icon={Clock3}
      />

      <KPIStat
        title="Total Clients"
        value="24"
        subtitle="+6 this year"
        icon={Users}
      />
    </div>
  );
}
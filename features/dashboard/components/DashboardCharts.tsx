import { RevenueChart } from "./RevenueChart";
import { EventTypeChart } from "./EventTypeChart";

export function DashboardCharts() {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2">
        <RevenueChart />
      </div>

      <EventTypeChart />
    </div>
  );
}

import type { Payment } from "@/features/payments/types";
import type { Event } from "@/features/events/types";

import { RevenueChart } from "./RevenueChart";
import { EventTypeChart } from "./EventTypeChart";

export function DashboardCharts({
  payments,
  events,
}: {
  payments: Payment[];
  events: Event[];
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2">
        <RevenueChart payments={payments} />
      </div>

      <EventTypeChart events={events} />
    </div>
  );
}

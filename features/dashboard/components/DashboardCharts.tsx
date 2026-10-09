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
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(288px,0.85fr)]">
      <RevenueChart payments={payments} />
      <EventTypeChart events={events} />
    </section>
  );
}
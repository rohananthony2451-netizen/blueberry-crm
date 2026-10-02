
"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getEvents } from "@/features/events/services/event.service";
import { getClients } from "@/features/clients/services/client.service";
import {
  getPayments,
  getPaymentSummary,
} from "@/features/payments/services/payment.service";

import type { Event } from "@/features/events/types";
import type { Client } from "@/features/clients/types";
import type { Payment, PaymentSummary } from "@/features/payments/types";

import { DashboardStats } from "./DashboardStats";
import { DashboardCharts } from "./DashboardCharts";
import { UpcomingEvents } from "./UpcomingEvents";
import { RecentActivity } from "./RecentActivity";

interface DashboardData {
  events: Event[];
  clients: Client[];
  payments: Payment[];
  paymentSummary: PaymentSummary;
}

function DashboardMessage({
  title,
  description,
  onRetry,
}: {
  title: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-2xl border bg-white p-8 text-center">
      <AlertCircle className="mx-auto mb-3 h-8 w-8 text-slate-400" />
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      {onRetry && (
        <Button className="mt-4" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      )}
    </div>
  );
}

export function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [events, clients, payments, paymentSummary] =
        await Promise.all([
          getEvents(),
          getClients(),
          getPayments(),
          getPaymentSummary(),
        ]);

      setData({ events, clients, payments, paymentSummary });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border bg-white p-8 text-center text-slate-500"
      >
        Loading your dashboard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <DashboardMessage
        title="Dashboard data unavailable"
        description={error ?? "No dashboard data could be loaded."}
        onRetry={() => void loadDashboard()}
      />
    );
  }

  const today = new Date().toLocaleDateString("en-CA");

  const upcomingEvents = data.events
    .filter(
      (event) =>
        event.status !== "Cancelled" &&
        event.eventDate >= today
    )
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
    .slice(0, 5);

  const recentPayments = [...data.payments]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const completedEvents = data.events.filter(
    (event) => event.status === "Completed"
  ).length;

  return (
    <>
      <DashboardStats
        totalReceived={data.paymentSummary.totalReceived}
        completedEvents={completedEvents}
        pendingAmount={data.paymentSummary.pendingAmount}
        totalClients={data.clients.length}
      />

      <DashboardCharts
        payments={data.payments}
        events={data.events}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingEvents events={upcomingEvents} />
        <RecentActivity payments={recentPayments} />
      </div>
    </>
  );
}

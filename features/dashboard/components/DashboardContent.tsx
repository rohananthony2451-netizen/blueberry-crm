"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getEvents } from "@/features/events/services/event.service";
import { getClients } from "@/features/clients/services/client.service";
import {
  getPayments,
  getPaymentSummary,
} from "@/features/payments/services/payment.service";
import { getLeads } from "@/features/leads/services/lead.service";

import type { Event } from "@/features/events/types";
import type { Client } from "@/features/clients/types";
import type { Payment, PaymentSummary } from "@/features/payments/types";
import type { Lead } from "@/features/leads/types";

import { DashboardStats } from "./DashboardStats";
import { DashboardCharts } from "./DashboardCharts";
import { UpcomingEvents } from "./UpcomingEvents";
import { DashboardQuickActions } from "./DashboardQuickActions";

interface DashboardData {
  events: Event[];
  clients: Client[];
  payments: Payment[];
  paymentSummary: PaymentSummary;
  leads: Lead[];
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
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
        <AlertCircle className="h-5 w-5 text-slate-500" />
      </div>

      <h2 className="text-base font-semibold text-slate-900">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      {onRetry && (
        <Button
          className="mt-5 rounded-xl"
          onClick={onRetry}
          variant="outline"
        >
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
      const [events, clients, payments, paymentSummary, leads] =
        await Promise.all([
          getEvents(),
          getClients(),
          getPayments(),
          getPaymentSummary(),
          getLeads(),
        ]);

      setData({
        events,
        clients,
        payments,
        paymentSummary,
        leads,
      });
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

  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-CA");
  }, []);

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm"
      >
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

        <p className="mt-4 text-sm font-medium text-slate-700">
          Loading your dashboard...
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Fetching your latest business data
        </p>
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

  const activeEvents = data.events.filter(
    (event) =>
      event.status !== "Completed" &&
      event.status !== "Cancelled"
  ).length;

  const newLeads = data.leads.length;

  const upcomingEvents = data.events
    .filter(
      (event) =>
        event.status !== "Cancelled" &&
        event.eventDate >= today
    )
    .sort((a, b) =>
      a.eventDate.localeCompare(b.eventDate)
    )
    .slice(0, 3);

  return (
    <div className="space-y-4">
      <DashboardStats
        totalRevenue={data.paymentSummary.totalReceived}
        activeEvents={activeEvents}
        pendingPayments={data.paymentSummary.pendingAmount}
        newLeads={newLeads}
      />

      <DashboardCharts
        payments={data.payments}
        events={data.events}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
        <UpcomingEvents events={upcomingEvents} />
        <DashboardQuickActions />
      </div>
    </div>
  );
}
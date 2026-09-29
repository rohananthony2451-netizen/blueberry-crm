
"use client";

import { useEffect, useState } from "react";
import {
  getEventFinancialSummary,
  type EventFinancialSummary,
} from "../services/eventFinancial.service";

interface EventFinancialOverviewProps {
  eventId: string;
}

const EMPTY_SUMMARY: EventFinancialSummary = {
  quotationCount: 0,
  quotationTotal: 0,
  paymentsReceived: 0,
  customerBalance: 0,
  obligationCount: 0,
  obligationsTotal: 0,
  obligationsPaid: 0,
  obligationsRemaining: 0,
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function FinancialMetric({
  label,
  amount,
  emphasis = false,
}: {
  label: string;
  amount: number;
  emphasis?: boolean;
}) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p
        className={`mt-2 break-words text-lg font-semibold ${
          emphasis ? "text-slate-900" : "text-slate-700"
        }`}
      >
        {formatCurrency(amount)}
      </p>
    </div>
  );
}

export function EventFinancialOverview({
  eventId,
}: EventFinancialOverviewProps) {
  const [summary, setSummary] =
    useState<EventFinancialSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadSummary() {
      setLoading(true);
      setError(null);

      try {
        const result =
          await getEventFinancialSummary(eventId);

        if (active) {
          setSummary(result);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load event finances."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadSummary();

    return () => {
      active = false;
    };
  }, [eventId]);

  if (loading) {
    return (
      <section className="rounded-2xl border p-5">
        <h3 className="font-semibold">
          Event Financial Overview
        </h3>
        <p className="mt-3 text-sm text-slate-500">
          Loading financial summary...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <h3 className="font-semibold text-red-800">
          Event Financial Overview
        </h3>
        <p className="mt-2 text-sm text-red-700">
          Failed to load finances: {error}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5 rounded-2xl border p-5">
      <div>
        <h3 className="text-lg font-semibold">
          Event Financial Overview
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Financial records linked to this event.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="font-semibold">
            People Owe Us
          </h4>
          <p className="mt-1 text-xs text-slate-500">
            {summary.quotationCount === 0
              ? "No accepted quotation is linked to this event."
              : `${summary.quotationCount} accepted quotation(s)`}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FinancialMetric
            label="Accepted Quotation Total"
            amount={summary.quotationTotal}
          />
          <FinancialMetric
            label="Payments Received"
            amount={summary.paymentsReceived}
          />
          <FinancialMetric
            label="Customer Balance Remaining"
            amount={summary.customerBalance}
            emphasis
          />
        </div>
      </div>

      <div className="border-t pt-5">
        <div className="mb-3">
          <h4 className="font-semibold">
            We Owe People
          </h4>
          <p className="mt-1 text-xs text-slate-500">
            {summary.obligationCount === 0
              ? "No expense obligations are linked to this event."
              : `${summary.obligationCount} expense obligation(s)`}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FinancialMetric
            label="Total Amount Owed"
            amount={summary.obligationsTotal}
          />
          <FinancialMetric
            label="Already Paid"
            amount={summary.obligationsPaid}
          />
          <FinancialMetric
            label="Still to Pay"
            amount={summary.obligationsRemaining}
            emphasis
          />
        </div>
      </div>
    </section>
  );
}
"use client";

import { useState } from "react";

import {
  PageContainer,
} from "@/components/design-system/PageContainer";

import {
  PageHeader,
} from "@/components/design-system/PageHeader";

import {
  PaymentDialog,
} from "@/features/payments/components/PaymentDialog";

import {
  usePayments,
} from "@/features/payments/hooks/usePayments";

import type {
  PaymentFormValues,
} from "@/features/payments/types";

export default function PaymentsPage() {
  const [
    dialogOpen,
    setDialogOpen,
  ] = useState(false);

  const {
    payments,
    loading,
    error,
    createPayment,
  } = usePayments();

  async function handleCreatePayment(
    data: PaymentFormValues
  ) {
    await createPayment({
      clientId:
        data.clientId,

      eventId:
        data.eventId || null,

      quotationId:
        data.quotationId || null,

      paymentDate:
        data.paymentDate,

      amount:
        Number(data.amount),

      paymentMethod:
        data.paymentMethod,

      referenceNumber:
        data.referenceNumber,

      notes:
        data.notes,
    });
  }

  const totalReceived =
    payments.reduce(
      (sum, payment) =>
        sum + payment.amount,
      0
    );

  return (
    <PageContainer>
      <PageHeader
        title="Payments"
        description="Track payments received from your clients."
      />

      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={() =>
            setDialogOpen(true)
          }
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          + Record Payment
        </button>
      </div>

      <PaymentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleCreatePayment}
      />

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-background p-5">
          <p className="text-sm text-slate-500">
            Total Received
          </p>

          <p className="mt-2 text-2xl font-bold">
            ₹
            {totalReceived.toLocaleString(
              "en-IN"
            )}
          </p>
        </div>

        <div className="rounded-2xl border bg-background p-5">
          <p className="text-sm text-slate-500">
            Transactions
          </p>

          <p className="mt-2 text-2xl font-bold">
            {payments.length}
          </p>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border bg-white p-10 text-center text-sm text-slate-500">
          Loading payments...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-sm text-red-600">
          Failed to load payments:{" "}
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        payments.length === 0 && (
          <div className="rounded-2xl border bg-white p-10 text-center">
            <p className="text-sm font-medium">
              No payments recorded yet.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Record your first payment to start tracking revenue.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        payments.length > 0 && (
          <div className="overflow-hidden rounded-2xl border bg-background">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50/70 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3">
                      Payment No.
                    </th>

                    <th className="px-4 py-3">
                      Client
                    </th>

                    <th className="px-4 py-3">
                      Event
                    </th>

                    <th className="px-4 py-3">
                      Quotation
                    </th>

                    <th className="px-4 py-3">
                      Date
                    </th>

                    <th className="px-4 py-3">
                      Method
                    </th>

                    <th className="px-4 py-3 text-right">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map(
                    (payment) => (
                      <tr
                        key={payment.id}
                        className="border-t border-slate-100"
                      >
                        <td className="px-4 py-4 font-medium text-primary">
                          {
                            payment.paymentNumber
                          }
                        </td>

                        <td className="px-4 py-4 font-medium">
                          {
                            payment.clientName
                          }
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {
                            payment.eventName ??
                            "—"
                          }
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {
                            payment.quotationNumber ??
                            "—"
                          }
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {new Intl.DateTimeFormat(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          ).format(
                            new Date(
                              payment.paymentDate
                            )
                          )}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {
                            payment.paymentMethod
                          }
                        </td>

                        <td className="px-4 py-4 text-right font-semibold">
                          ₹
                          {payment.amount.toLocaleString(
                            "en-IN"
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </PageContainer>
  );
}
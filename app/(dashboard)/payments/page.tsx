"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { PaymentDialog } from "@/features/payments/components/PaymentDialog";
import { PaymentDeleteDialog } from "@/features/payments/components/PaymentDeleteDialog";
import { PaymentEditDialog } from "@/features/payments/components/PaymentEditDialog";
import { PaymentTable } from "@/features/payments/components/PaymentTable";
import { PendingPaymentsDialog } from "@/features/payments/components/PendingPaymentsDialog";

import { usePayments } from "@/features/payments/hooks/usePayments";

import type {
  Payment,
  PaymentFormValues,
} from "@/features/payments/types";

export default function PaymentsPage() {
  const {
    payments,
    summary,
    loading,
    summaryLoading,
    error,
    createPayment,
    updatePayment,
    deletePayment,
  } = usePayments();

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [
    pendingDialogOpen,
    setPendingDialogOpen,
  ] = useState(false);

  const [editingPayment, setEditingPayment] =
    useState<Payment | null>(null);

  const [deletingPayment, setDeletingPayment] =
    useState<Payment | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  async function handleCreatePayment(
    data: PaymentFormValues
  ) {
    await createPayment({
      clientId: data.clientId,
      eventId: data.eventId || null,
      quotationId:
        data.quotationId || null,
      paymentDate: data.paymentDate,
      amount: Number(data.amount),
      paymentMethod:
        data.paymentMethod,
      referenceNumber:
        data.referenceNumber,
      notes: data.notes,
    });
  }

  function handleEditPayment(
    payment: Payment
  ) {
    setEditingPayment(payment);
  }

  function handleEditDialogChange(
    open: boolean
  ) {
    if (!open) {
      setEditingPayment(null);
    }
  }

  async function handleUpdatePayment(
    id: string,
    data: PaymentFormValues
  ) {
    await updatePayment(id, {
      clientId: data.clientId,
      eventId: data.eventId || null,
      quotationId:
        data.quotationId || null,
      paymentDate: data.paymentDate,
      amount: Number(data.amount),
      paymentMethod:
        data.paymentMethod,
      referenceNumber:
        data.referenceNumber,
      notes: data.notes,
    });
  }

  function handleDeletePayment(
    payment: Payment
  ) {
    setDeletingPayment(payment);
  }

  function handleDeleteDialogChange(
    open: boolean
  ) {
    if (!open) {
      setDeletingPayment(null);
    }
  }

  async function handleConfirmDelete() {
    if (!deletingPayment) {
      return;
    }

    try {
      setDeleting(true);

      await deletePayment(
        deletingPayment.id
      );

      setDeletingPayment(null);
    } finally {
      setDeleting(false);
    }
  }

  function formatCurrency(
    value: number
  ) {
    return `₹${value.toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    )}`;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Payments
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Track payments received from your
            clients and monitor outstanding amounts.
          </p>
        </div>

        <Button
          onClick={() =>
            setDialogOpen(true)
          }
        >
          Record Payment
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Financial Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Received
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {summaryLoading
              ? "Loading..."
              : formatCurrency(
                  summary.totalReceived
                )}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Total payments recorded
          </p>
        </div>

        {/* Pending Amount */}
        <button
          type="button"
          onClick={() =>
            setPendingDialogOpen(true)
          }
          className="rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          <p className="text-sm font-medium text-slate-500">
            Pending Amount
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {summaryLoading
              ? "Loading..."
              : formatCurrency(
                  summary.pendingAmount
                )}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Outstanding against quotations
          </p>

          {!summaryLoading &&
            summary.pendingAmount > 0 && (
              <p className="mt-3 text-xs font-medium text-slate-600">
                Click to view pending collections →
              </p>
            )}
        </button>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            This Month
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {summaryLoading
              ? "Loading..."
              : formatCurrency(
                  summary.thisMonthReceived
                )}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Payments received this month
          </p>
        </div>
      </div>

      {/* Transactions */}
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-semibold">
              Transactions
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {loading
                ? "Loading payments..."
                : `${payments.length} payment${
                    payments.length === 1
                      ? ""
                      : "s"
                  } recorded`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            Loading payments...
          </div>
        ) : payments.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-medium text-slate-700">
              No payments recorded yet.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Record your first payment to start
              tracking your revenue.
            </p>

            <Button
              className="mt-4"
              onClick={() =>
                setDialogOpen(true)
              }
            >
              Record Payment
            </Button>
          </div>
        ) : (
          <PaymentTable
            payments={payments}
            onEdit={handleEditPayment}
            onDelete={handleDeletePayment}
          />
        )}
      </div>

      {/* Create Payment */}
      <PaymentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleCreatePayment}
      />

      {/* Pending Collections */}
      <PendingPaymentsDialog
        open={pendingDialogOpen}
        onOpenChange={
          setPendingDialogOpen
        }
      />

      {/* Edit Payment */}
      <PaymentEditDialog
        payment={editingPayment}
        open={Boolean(editingPayment)}
        onOpenChange={
          handleEditDialogChange
        }
        onSave={handleUpdatePayment}
      />

      {/* Delete Payment */}
      <PaymentDeleteDialog
        payment={deletingPayment}
        open={Boolean(deletingPayment)}
        onOpenChange={
          handleDeleteDialogChange
        }
        onConfirm={
          handleConfirmDelete
        }
        deleting={deleting}
      />
    </div>
  );
}
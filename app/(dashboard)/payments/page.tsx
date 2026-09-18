"use client";

import {
  useState,
} from "react";

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
  PaymentEditDialog,
} from "@/features/payments/components/PaymentEditDialog";

import {
  PaymentDeleteDialog,
} from "@/features/payments/components/PaymentDeleteDialog";

import {
  PaymentTable,
} from "@/features/payments/components/PaymentTable";

import {
  usePayments,
} from "@/features/payments/hooks/usePayments";

import type {
  Payment,
  PaymentFormValues,
} from "@/features/payments/types";

export default function PaymentsPage() {
  const [
    dialogOpen,
    setDialogOpen,
  ] = useState(false);

  const [
    editingPayment,
    setEditingPayment,
  ] = useState<Payment | null>(
    null
  );

  const [
    deletingPayment,
    setDeletingPayment,
  ] = useState<Payment | null>(
    null
  );

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const {
    payments,
    loading,
    error,
    createPayment,
    updatePayment,
    deletePayment,
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
        data.quotationId ||
        null,

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

  function handleEditPayment(
    payment: Payment
  ) {
    setEditingPayment(
      payment
    );
  }

  function handleEditDialogChange(
    open: boolean
  ) {
    if (!open) {
      setEditingPayment(
        null
      );
    }
  }

  async function handleUpdatePayment(
    id: string,
    data: PaymentFormValues
  ) {
    await updatePayment(
      id,
      {
        clientId:
          data.clientId,

        eventId:
          data.eventId ||
          null,

        quotationId:
          data.quotationId ||
          null,

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
      }
    );
  }

  function handleDeletePayment(
    payment: Payment
  ) {
    setDeletingPayment(
      payment
    );
  }

  function handleDeleteDialogChange(
    open: boolean
  ) {
    if (!open && !deleting) {
      setDeletingPayment(
        null
      );
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
        onOpenChange={
          setDialogOpen
        }
        onSave={
          handleCreatePayment
        }
      />

      <PaymentEditDialog
        payment={
          editingPayment
        }
        open={
          editingPayment !==
          null
        }
        onOpenChange={
          handleEditDialogChange
        }
        onSave={
          handleUpdatePayment
        }
      />

      <PaymentDeleteDialog
        payment={
          deletingPayment
        }
        open={
          deletingPayment !==
          null
        }
        onOpenChange={
          handleDeleteDialogChange
        }
        onConfirm={
          handleConfirmDelete
        }
        deleting={
          deleting
        }
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
        !error && (
          <PaymentTable
            payments={payments}
            onEdit={
              handleEditPayment
            }
            onDelete={
              handleDeletePayment
            }
          />
        )}
    </PageContainer>
  );
}
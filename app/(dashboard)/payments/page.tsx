
"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  CalendarDays,
  Clock3,
  CreditCard,
  ReceiptText,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PaymentDialog } from "@/features/payments/components/PaymentDialog";
import { PaymentDeleteDialog } from "@/features/payments/components/PaymentDeleteDialog";
import { PaymentEditDialog } from "@/features/payments/components/PaymentEditDialog";
import { PaymentTable } from "@/features/payments/components/PaymentTable";
import { PendingPaymentsDialog } from "@/features/payments/components/PendingPaymentsDialog";
import { usePayments } from "@/features/payments/hooks/usePayments";
import { useQuotations } from "@/features/quotations/hooks/useQuotations";
import type { Payment, PaymentFormValues } from "@/features/payments/types";

import { PageContainer } from "@/components/design-system/PageContainer";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

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

  const { quotations } = useQuotations();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingDialogOpen, setPendingDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [deletingPayment, setDeletingPayment] = useState<Payment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const balanceByQuotation = useMemo(() => {
    const receivedByQuotation = new Map<string, number>();

    for (const payment of payments) {
      if (!payment.quotationId) continue;

      receivedByQuotation.set(
        payment.quotationId,
        (receivedByQuotation.get(payment.quotationId) ?? 0) + payment.amount
      );
    }

    const balances: Record<string, number> = {};

    for (const quotation of quotations) {
      balances[quotation.id] = Math.max(
        quotation.total - (receivedByQuotation.get(quotation.id) ?? 0),
        0
      );
    }

    return balances;
  }, [payments, quotations]);

  async function handleCreatePayment(data: PaymentFormValues) {
    await createPayment({
      clientId: data.clientId,
      eventId: data.eventId || null,
      quotationId: data.quotationId || null,
      paymentDate: data.paymentDate,
      amount: Number(data.amount),
      paymentMethod: data.paymentMethod,
      referenceNumber: data.referenceNumber,
      notes: data.notes,
    });
  }

  function handleEditPayment(payment: Payment) {
    setEditingPayment(payment);
  }

  function handleEditDialogChange(open: boolean) {
    if (!open) setEditingPayment(null);
  }

  async function handleUpdatePayment(id: string, data: PaymentFormValues) {
    await updatePayment(id, {
      clientId: data.clientId,
      eventId: data.eventId || null,
      quotationId: data.quotationId || null,
      paymentDate: data.paymentDate,
      amount: Number(data.amount),
      paymentMethod: data.paymentMethod,
      referenceNumber: data.referenceNumber,
      notes: data.notes,
    });
  }

  function handleDeletePayment(payment: Payment) {
    setDeletingPayment(payment);
  }

  function handleDeleteDialogChange(open: boolean) {
    if (!open) setDeletingPayment(null);
  }

  async function handleConfirmDelete() {
    if (!deletingPayment) return;

    try {
      setDeleting(true);
      await deletePayment(deletingPayment.id);
      setDeletingPayment(null);
    } finally {
      setDeleting(false);
    }
  }

  const cards = [
    {
      label: "Total Received",
      value: summary.totalReceived,
      description: "All recorded payments",
      icon: Wallet,
      iconClass: "bg-emerald-50 text-emerald-600",
      valueClass: "text-slate-900",
    },
    {
      label: "Pending Amount",
      value: summary.pendingAmount,
      description: "Outstanding on active quotations",
      icon: Clock3,
      iconClass: "bg-amber-50 text-amber-600",
      valueClass: "text-amber-600",
      clickable: true,
    },
    {
      label: "This Month",
      value: summary.thisMonthReceived,
      description: "Payments received this month",
      icon: CalendarDays,
      iconClass: "bg-blue-50 text-blue-600",
      valueClass: "text-slate-900",
    },
  ];

  return (
    <PageContainer>
        <div className="mx-auto w-full max-w-[1440px] space-y-5 pb-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Payments
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track received payments and outstanding collections.
          </p>
          </div>

        <Button
          onClick={() => setDialogOpen(true)}
          className="h-9 gap-2 rounded-lg px-3.5 shadow-sm"
        >
          <ArrowDownLeft size={16} />
          Record Payment
        </Button>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}

      <section
        aria-label="Payment summary"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {cards.map((card) => {
          const Icon = card.icon;

          const content = (
            <div className="flex min-h-[112px] items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm transition-colors hover:border-slate-300">
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-slate-500">
                  {card.label}
                </p>
                <p
                  className={`mt-2 text-[22px] font-semibold leading-tight tracking-tight tabular-nums ${card.valueClass}`}
                >
                  {summaryLoading ? "—" : formatCurrency(card.value)}
                </p>
                <p className="mt-1.5 text-xs text-slate-400">
                  {card.description}
                </p>
              </div>

              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${card.iconClass}`}
              >
                <Icon size={18} strokeWidth={1.8} />
              </span>
            </div>
          );

          return card.clickable ? (
            <button
              key={card.label}
              type="button"
              onClick={() => setPendingDialogOpen(true)}
              className="w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              {content}
            </button>
          ) : (
            <div key={card.label}>{content}</div>
          );
        })}

        <div className="flex min-h-[112px] items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-slate-500">
              Transactions
            </p>
            <p className="mt-2 text-[22px] font-semibold leading-tight tracking-tight text-slate-900 tabular-nums">
              {loading ? "—" : payments.length.toLocaleString("en-IN")}
            </p>
            <p className="mt-1.5 text-xs text-slate-400">
              Total payments recorded
            </p>
          </div>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <ReceiptText size={18} strokeWidth={1.8} />
          </span>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Transactions
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {loading
                ? "Loading payments…"
                : `${payments.length.toLocaleString("en-IN")} payment${payments.length === 1 ? "" : "s"} recorded`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="px-4 py-10 text-center text-sm text-slate-500">
            Loading payments…
          </div>
        ) : payments.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <span className="mx-auto flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <CreditCard size={19} />
            </span>
            <p className="mt-3 text-sm font-semibold text-slate-800">
              No payments recorded yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Record your first payment to start tracking collections.
            </p>
            <Button className="mt-4" onClick={() => setDialogOpen(true)}>
              Record Payment
            </Button>
          </div>
        ) : (
          <PaymentTable
            payments={payments}
            balanceByQuotation={balanceByQuotation}
            onEdit={handleEditPayment}
            onDelete={handleDeletePayment}
          />
        )}
      </section>

      <PaymentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleCreatePayment}
      />

      <PendingPaymentsDialog
        open={pendingDialogOpen}
        onOpenChange={setPendingDialogOpen}
      />

      <PaymentEditDialog
        payment={editingPayment}
        open={Boolean(editingPayment)}
        onOpenChange={handleEditDialogChange}
        onSave={handleUpdatePayment}
      />

      <PaymentDeleteDialog
        payment={deletingPayment}
        open={Boolean(deletingPayment)}
        onOpenChange={handleDeleteDialogChange}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
      />
      </div>
</PageContainer>
  );
}

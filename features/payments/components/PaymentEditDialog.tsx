"use client";

import { useState } from "react";
import type { ComponentProps } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { PaymentForm } from "./PaymentForm";

import { useClients } from "@/features/clients/hooks/useClients";
import { useEvents } from "@/features/events/hooks/useEvents";
import { useQuotations } from "@/features/quotations/hooks/useQuotations";

import type {
  Payment,
  PaymentFormValues,
} from "../types";

interface PaymentEditDialogProps {
  payment: Payment | null;
  open: boolean;
  onOpenChange: (
    open: boolean
  ) => void;

  onSave: (
    id: string,
    data: PaymentFormValues
  ) => Promise<void>;
}

export function PaymentEditDialog({
  payment,
  open,
  onOpenChange,
  onSave,
}: PaymentEditDialogProps) {
  const {
    clients,
    loading: clientsLoading,
  } = useClients();

  const {
    events,
    loading: eventsLoading,
  } = useEvents();

  const {
    quotations,
    loading: quotationsLoading,
  } = useQuotations();

  const [
    saving,
    setSaving,
  ] = useState(false);

  async function handleSave(
    data: PaymentFormValues
  ) {
    if (!payment) {
      return;
    }

    try {
      setSaving(true);

      await onSave(
        payment.id,
        data
      );

      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  const handlePointerDownOutside: ComponentProps<
    typeof DialogContent
  >["onPointerDownOutside"] = (event) => {
    const target =
      event.target as HTMLElement | null;

    if (
      target?.closest(
        '[data-slot="select-content"]'
      )
    ) {
      event.preventDefault();
    }
  };

  const loading =
    clientsLoading ||
    eventsLoading ||
    quotationsLoading;

  const initialValues:
    | PaymentFormValues
    | undefined = payment
    ? {
        clientId:
          payment.clientId,

        eventId:
          payment.eventId ?? "",

        quotationId:
          payment.quotationId ??
          "",

        paymentDate:
          payment.paymentDate,

        amount:
          String(payment.amount),

        paymentMethod:
          payment.paymentMethod,

        referenceNumber:
          payment.referenceNumber,

        notes:
          payment.notes,
      }
    : undefined;

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-3xl"
        onPointerDownOutside={
          handlePointerDownOutside
        }
      >
        <DialogHeader>
          <DialogTitle className="text-xl">
            Edit Payment
          </DialogTitle>

          <DialogDescription>
            Update the payment details. The payment number will remain unchanged.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-10 text-center text-sm text-slate-500">
            Loading clients, events and quotations...
          </div>
        ) : !payment ? (
          <div className="py-10 text-center text-sm text-slate-500">
            Payment not found.
          </div>
        ) : (
          <PaymentForm
            clients={clients}
            events={events}
            quotations={quotations}
            initialValues={
              initialValues
            }
            onCancel={() =>
              onOpenChange(false)
            }
            onSave={handleSave}
            saveText={
              saving
                ? "Saving..."
                : "Save Changes"
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
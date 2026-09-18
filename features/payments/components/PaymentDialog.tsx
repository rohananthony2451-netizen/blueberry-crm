"use client";

import { useState } from "react";

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

import type { PaymentFormValues } from "../types";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (
    data: PaymentFormValues
  ) => Promise<void>;
}

export function PaymentDialog({
  open,
  onOpenChange,
  onSave,
}: PaymentDialogProps) {
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

  const [saving, setSaving] =
    useState(false);

  async function handleSave(
    data: PaymentFormValues
  ) {
    try {
      setSaving(true);

      await onSave(data);

      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  const loading =
    clientsLoading ||
    eventsLoading ||
    quotationsLoading;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Record Payment
          </DialogTitle>

          <DialogDescription>
            Record a payment received from your client.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-10 text-center text-sm text-slate-500">
            Loading clients, events and quotations...
          </div>
        ) : clients.length === 0 ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-700">
            Please create at least one client before recording a payment.
          </div>
        ) : (
          <PaymentForm
            clients={clients}
            events={events}
            quotations={quotations}
            onCancel={() =>
              onOpenChange(false)
            }
            onSave={handleSave}
            saveText={
              saving
                ? "Recording..."
                : "Record Payment"
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
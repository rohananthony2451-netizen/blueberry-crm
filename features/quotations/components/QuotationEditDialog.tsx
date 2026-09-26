"use client";

import { useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { QuotationForm } from "./QuotationForm";

import { useClients } from "@/features/clients/hooks/useClients";
import { useEvents } from "@/features/events/hooks/useEvents";

import type {
  Quotation,
  QuotationFormValues,
} from "../types";

interface QuotationEditDialogProps {
  quotation: Quotation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (
    id: string,
    data: QuotationFormValues
  ) => Promise<void>;
}

export function QuotationEditDialog({
  quotation,
  open,
  onOpenChange,
  onSave,
}: QuotationEditDialogProps) {
  const {
    clients,
    loading: clientsLoading,
  } = useClients();

  const {
    events,
    loading: eventsLoading,
  } = useEvents();

  const [saving, setSaving] =
    useState(false);

  const initialValues =
    useMemo<QuotationFormValues | undefined>(
      () => {
        if (!quotation) {
          return undefined;
        }

        return {
  clientId: quotation.clientId ?? "",
  leadId: quotation.leadId ?? "",

  prospectName: quotation.prospectName,
  prospectPhone: quotation.prospectPhone,
  prospectEmail: quotation.prospectEmail,
  prospectAddress: quotation.prospectAddress,

  eventName: quotation.proposedEventName,
  eventType: quotation.proposedEventType,
  eventDate: quotation.proposedEventDate,
  venue: quotation.proposedVenue,
  guestCount: String(
    quotation.proposedGuestCount
  ),

  quotationDate: quotation.quotationDate,
  validUntil: quotation.validUntil ?? "",

  discount: String(quotation.discount),
  tax: String(quotation.tax),

  notes: quotation.notes,

  items: quotation.items.map((item) => ({
    id: item.id,
    description: item.description,
    quantity: String(item.quantity),
    unitPrice: String(item.unitPrice),
  })),
}
      },
      [quotation]
    );

  if (!quotation) {
    return null;
  }

  const currentQuotation =
    quotation;

  async function handleSave(
    data: QuotationFormValues
  ) {
    try {
      setSaving(true);

      await onSave(
        currentQuotation.id,
        data
      );

      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  const loading =
    clientsLoading ||
    eventsLoading;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Edit Quotation
          </DialogTitle>

          <DialogDescription>
            Update the quotation details
            and line items.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-10 text-center text-sm text-slate-500">
            Loading clients and events...
          </div>
        ) : (
          <QuotationForm
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
                : "Update Quotation"
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
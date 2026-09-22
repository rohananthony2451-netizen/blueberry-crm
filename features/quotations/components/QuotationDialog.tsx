"use client";

import { useState } from "react";

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
  QuotationFormValues,
} from "../types";

interface QuotationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  onSave: (
    data: QuotationFormValues
  ) => Promise<void>;

  initialValues?: QuotationFormValues;
}

export function QuotationDialog({
  open,
  onOpenChange,
  onSave,
  initialValues,
}: QuotationDialogProps) {
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

  async function handleSave(
    data: QuotationFormValues
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
    eventsLoading;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Create Quotation
          </DialogTitle>

          <DialogDescription>
            Create a quotation for your client
            and save it as a draft.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-10 text-center text-sm text-slate-500">
            Loading clients and events...
          </div>
        ) : clients.length === 0 ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-700">
            Please create at least one client
            before creating a quotation.
          </div>
        ) : (
          <QuotationForm
            key={
              initialValues?.clientId ??
              "new-quotation"
            }
            clients={clients}
            events={events}
            initialValues={initialValues}
            onCancel={() =>
              onOpenChange(false)
            }
            onSave={handleSave}
            saveText={
              saving
                ? "Saving..."
                : "Save as Draft"
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
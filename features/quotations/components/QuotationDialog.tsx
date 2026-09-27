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
            Create a quotation for this prospect
            and save it as a draft.
          </DialogDescription>
        </DialogHeader>

        {clientsLoading ? (
          <div className="py-10 text-center text-sm text-slate-500">
            Loading...
          </div>
        ) : (
          <QuotationForm
            key={
              initialValues?.leadId ||
              initialValues?.clientId ||
              "new-quotation"
            }
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
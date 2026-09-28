"use client";

import { useMemo, useState } from "react";

import { Lead } from "../types";
import { StatusBadge } from "./StatusBadge";
import { SourceBadge } from "./SourceBadge";
import { Button } from "@/components/ui/button";

import { QuotationDialog } from "@/features/quotations/components/QuotationDialog";
import {
  createQuotation,
} from "@/features/quotations/services/quotation.service";

import type {
  QuotationFormValues,
} from "@/features/quotations/types";

interface LeadDetailsProps {
  lead: Lead;
  onEdit?: () => void;
  onDelete?: (id: string) => Promise<void>;
}

export function LeadDetails({
  lead,
  onEdit,
  onDelete,
}: LeadDetailsProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [quotationDialogOpen, setQuotationDialogOpen] =
    useState(false);

  const quotationInitialValues = useMemo<QuotationFormValues>(
    () => ({
      clientId: "",
      leadId: lead.id,

      prospectName: lead.clientName,
      prospectPhone: lead.phone,
      prospectEmail: "",
      prospectAddress: "",

      eventName: lead.eventType
        ? `${lead.clientName} - ${lead.eventType}`
        : lead.clientName,

      eventType: lead.eventType,
      eventDate: lead.eventDate,
      venue: "",
      guestCount: "",

      quotationDate: new Date()
        .toISOString()
        .split("T")[0],

      validUntil: "",

      discount: "0",
      tax: "0",

      notes: [
        lead.notes?.trim(),
        lead.budget
          ? `Lead budget: ${lead.budget}`
          : "",
      ]
        .filter(Boolean)
        .join("\n"),

      items: [
        {
          description: "",
          quantity: "1",
          unitPrice: "0",
          ourExpense: false,
        },
      ],
    }),
    [
      lead.id,
      lead.clientName,
      lead.phone,
      lead.eventType,
      lead.eventDate,
      lead.budget,
      lead.notes,
    ]
  );

  async function handleCreateQuotation(
    formData: QuotationFormValues
  ) {
    await createQuotation({
      clientId: formData.clientId || "",
      leadId: formData.leadId || lead.id,

      prospectName: formData.prospectName,
      prospectPhone: formData.prospectPhone,
      prospectEmail: formData.prospectEmail,
      prospectAddress: formData.prospectAddress,

      eventName: formData.eventName,
      eventType: formData.eventType,
      eventDate: formData.eventDate,
      venue: formData.venue,
      guestCount: Number(formData.guestCount),

      quotationDate: formData.quotationDate,
      validUntil: formData.validUntil || null,

      discount: Number(formData.discount),
      tax: Number(formData.tax),

      notes: formData.notes,

      items: formData.items.map((item) => {
        const quantity = Number(item.quantity);
        const unitPrice = Number(item.unitPrice);

        return {
          ...(item.id ? { id: item.id } : {}),
          description: item.description,
          quantity,
          unitPrice,
          amount: quantity * unitPrice,
            ourExpense:
    item.ourExpense,
        };
      }),
    });

    setQuotationDialogOpen(false);
  }

  async function handleDelete() {
    if (!onDelete) return;

    setDeleting(true);

    try {
      await onDelete(lead.id);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">
            {lead.clientName}
          </h2>

          <p className="text-slate-500">
            {lead.phone}
          </p>
        </div>

        <div className="space-y-3">
          <Info
            label="Event"
            value={lead.eventType}
          />

          <Info
            label="Date"
            value={lead.eventDate}
          />

          <Info
            label="Budget"
            value={lead.budget}
          />

          <div className="border-b pb-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Source
            </p>

            <div className="mt-1">
              <SourceBadge source={lead.source} />
            </div>
          </div>

          <Info
            label="Assigned"
            value={
              lead.assignedTo ||
              "Not assigned"
            }
          />

          <div className="border-b pb-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Status
            </p>

            <div className="mt-1">
              <StatusBadge status={lead.status} />
            </div>
          </div>

          <Info
            label="Notes"
            value={
              lead.notes ||
              "No notes added."
            }
          />
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t pt-6">
          <Button
            type="button"
            onClick={() =>
              setQuotationDialogOpen(true)
            }
          >
            Create Quotation
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onEdit}
          >
            Edit Lead
          </Button>

          {!confirmDelete ? (
            <Button
              type="button"
              variant="destructive"
              onClick={() =>
                setConfirmDelete(true)
              }
            >
              Delete Lead
            </Button>
          ) : null}
        </div>

        {confirmDelete ? (
          <div className="space-y-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <div>
              <p className="font-semibold text-red-900">
                Delete this lead?
              </p>

              <p className="mt-1 text-sm text-red-700">
                This action cannot be undone.
                The lead will be permanently
                removed from your workspace.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setConfirmDelete(false)
                }
                disabled={deleting}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting
                  ? "Deleting..."
                  : "Yes, Delete Lead"}
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <QuotationDialog
        open={quotationDialogOpen}
        onOpenChange={setQuotationDialogOpen}
        initialValues={
          quotationInitialValues
        }
        onSave={handleCreateQuotation}
      />
    </>
  );
}

interface InfoProps {
  label: string;
  value: string;
}

function Info({
  label,
  value,
}: InfoProps) {
  return (
    <div className="border-b pb-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-medium">
        {value}
      </p>
    </div>
  );
}
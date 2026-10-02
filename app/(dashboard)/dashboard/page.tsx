"use client";

import { useState } from "react";

import { PageContainer } from "@/components/design-system/PageContainer";
import { PageHeader } from "@/components/design-system/PageHeader";
import { QuotationDialog } from "@/features/quotations/components/QuotationDialog";
import { useQuotations } from "@/features/quotations/hooks/useQuotations";
import type {
  QuotationFormValues,
} from "@/features/quotations/types";

import { DashboardContent } from "@/features/dashboard/components/DashboardContent";

export default function DashboardPage() {
  const [quotationDialogOpen, setQuotationDialogOpen] =
    useState(false);

  const { createQuotation } = useQuotations();

  async function handleCreateQuotation(
    data: QuotationFormValues
  ) {
    await createQuotation({
      clientId: data.clientId,
      leadId: data.leadId,

      prospectName: data.prospectName,
      prospectPhone: data.prospectPhone,
      prospectEmail: data.prospectEmail,
      prospectAddress: data.prospectAddress,

      eventName: data.eventName,
      eventType: data.eventType,
      eventDate: data.eventDate,
      venue: data.venue,
      guestCount: Number(data.guestCount),

      quotationDate: data.quotationDate,

      validUntil: data.validUntil || null,

      discount: Number(data.discount),
      tax: Number(data.tax),

      notes: data.notes,

      items: data.items.map((item) => {
        const quantity = Number(item.quantity);
        const unitPrice = Number(item.unitPrice);

        return {
          description: item.description,
          quantity,
          unitPrice,
          amount: quantity * unitPrice,
          ourExpense: item.ourExpense,
        };
      }),
    });
  }

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Welcome back to Eventos."
      />

      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={() => setQuotationDialogOpen(true)}
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          + New Quotation
        </button>
      </div>

      <DashboardContent />

      <QuotationDialog
        open={quotationDialogOpen}
        onOpenChange={setQuotationDialogOpen}
        onSave={handleCreateQuotation}
      />
    </PageContainer>
  );
} 
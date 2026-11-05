"use client";

import { useEffect, useState } from "react";
import { FilePlus2 } from "lucide-react";

import { PageContainer } from "@/components/design-system/PageContainer";
import { QuotationDialog } from "@/features/quotations/components/QuotationDialog";
import { useQuotations } from "@/features/quotations/hooks/useQuotations";
import type { QuotationFormValues } from "@/features/quotations/types";
import { useCurrentUser } from "@/components/layout/CurrentUserContext";

import { DashboardContent } from "@/features/dashboard/components/DashboardContent";

export default function DashboardPage() {
  const [quotationDialogOpen, setQuotationDialogOpen] =
    useState(false);

  const { createQuotation } = useQuotations();
  const currentUser = useCurrentUser();
const firstName =
  currentUser.fullName.trim().split(/\s+/)[0] === "User"
    ? ""
    : currentUser.fullName.trim().split(/\s+/)[0];

const [greeting, setGreeting] = useState("Good morning");

useEffect(() => {
  function updateGreeting() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else if (hour >= 17 && hour < 22) {
      setGreeting("Good evening");
    } else {
      setGreeting("Still working this late");
    }
  }

  updateGreeting();

  const interval = window.setInterval(updateGreeting, 60_000);
  return () => window.clearInterval(interval);
}, []);

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
      <div className="space-y-5">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Overview
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 sm:text-[34px]">
              {greeting === "Still working this late"
                  ? `${greeting}, ${firstName}?`
                      : `${greeting}, ${firstName} 👋`}
                      </h1>

            <p className="mt-1.5 max-w-xl text-sm text-slate-500">
              Here&apos;s what&apos;s happening across your
              business today.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setQuotationDialogOpen(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <FilePlus2 className="h-4 w-4" />
            New quotation
          </button>
        </section>

        <DashboardContent />
      </div>

      <QuotationDialog
        open={quotationDialogOpen}
        onOpenChange={setQuotationDialogOpen}
        onSave={handleCreateQuotation}
      />
    </PageContainer>
  );
}
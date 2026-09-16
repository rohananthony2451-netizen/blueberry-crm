"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  PageContainer,
} from "@/components/design-system/PageContainer";

import {
  PageHeader,
} from "@/components/design-system/PageHeader";

import {
  QuotationTable,
} from "@/features/quotations/components/QuotationTable";

import {
  QuotationDialog,
} from "@/features/quotations/components/QuotationDialog";

import {
  useQuotations,
} from "@/features/quotations/hooks/useQuotations";

import {
  QUOTATION_STATUSES,
} from "@/features/quotations/constants";

import type {
  QuotationFormValues,
} from "@/features/quotations/types";

import type {
  QuotationStatus,
} from "@/features/quotations/types";

type FilterStatus =
  | "All"
  | QuotationStatus;

export default function QuotationsPage() {
  const [
    filter,
    setFilter,
  ] = useState<FilterStatus>(
    "All"
  );

  const [
    dialogOpen,
    setDialogOpen,
  ] = useState(false);

  const {
    quotations,
    loading,
    error,
    createQuotation,
  } = useQuotations();

  const filteredQuotations =
    useMemo(() => {
      if (filter === "All") {
        return quotations;
      }

      return quotations.filter(
        (quotation) =>
          quotation.status === filter
      );
    }, [
      quotations,
      filter,
    ]);

  const statusCount = (
    status: FilterStatus
  ) => {
    if (status === "All") {
      return quotations.length;
    }

    return quotations.filter(
      (quotation) =>
        quotation.status === status
    ).length;
  };

  async function handleCreateQuotation(
    data: QuotationFormValues
  ) {
    await createQuotation({
      clientId: data.clientId,

      eventId:
        data.eventId || null,

      quotationDate:
        data.quotationDate,

      validUntil:
        data.validUntil || null,

      discount:
        Number(data.discount),

      tax:
        Number(data.tax),

      notes:
        data.notes,

      items:
        data.items.map(
          (item) => {
            const quantity =
              Number(
                item.quantity
              );

            const unitPrice =
              Number(
                item.unitPrice
              );

            return {
              description:
                item.description,

              quantity,

              unitPrice,

              amount:
                quantity *
                unitPrice,
            };
          }
        ),
    });
  }

  return (
    <PageContainer>
      <PageHeader
        title="Quotations"
        description="Create and manage quotations for your clients."
      />

      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={() =>
            setDialogOpen(true)
          }
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          + New Quotation
        </button>
      </div>

      <QuotationDialog
        open={dialogOpen}
        onOpenChange={
          setDialogOpen
        }
        onSave={
          handleCreateQuotation
        }
      />

      <div className="mb-4 overflow-x-auto">
        <div className="flex min-w-max gap-2">
          <button
            type="button"
            onClick={() =>
              setFilter("All")
            }
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === "All"
                ? "bg-primary text-primary-foreground"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            All{" "}
            <span className="ml-1 opacity-70">
              {statusCount("All")}
            </span>
          </button>

          {QUOTATION_STATUSES.map(
            (status) => (
              <button
                key={status}
                type="button"
                onClick={() =>
                  setFilter(status)
                }
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filter === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {status}{" "}
                <span className="ml-1 opacity-70">
                  {statusCount(
                    status
                  )}
                </span>
              </button>
            )
          )}
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border bg-white p-10 text-center text-sm text-slate-500">
          Loading quotations...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-sm text-red-600">
          Failed to load quotations:{" "}
          {error}
        </div>
      )}

      {!loading &&
        !error && (
          <QuotationTable
            quotations={
              filteredQuotations
            }
          />
        )}
    </PageContainer>
  );
}
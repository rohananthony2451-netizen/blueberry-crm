"use client";

import { useMemo, useState } from "react";

import { PageContainer } from "@/components/design-system/PageContainer";
import { PageHeader } from "@/components/design-system/PageHeader";

import { QuotationTable } from "@/features/quotations/components/QuotationTable";
import { QuotationDialog } from "@/features/quotations/components/QuotationDialog";
import { QuotationViewDialog } from "@/features/quotations/components/QuotationViewDialog";
import { QuotationEditDialog } from "@/features/quotations/components/QuotationEditDialog";
import { QuotationDeleteDialog } from "@/features/quotations/components/QuotationDeleteDialog";

import { useQuotations } from "@/features/quotations/hooks/useQuotations";

import { QUOTATION_STATUSES } from "@/features/quotations/constants";

import type {
  Quotation,
  QuotationFormValues,
  QuotationStatus,
} from "@/features/quotations/types";

type FilterStatus =
  | "All"
  | QuotationStatus;

export default function QuotationsPage() {
  const [filter, setFilter] =
    useState<FilterStatus>("All");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [selectedQuotation, setSelectedQuotation] =
    useState<Quotation | null>(null);

  const [editingQuotation, setEditingQuotation] =
    useState<Quotation | null>(null);

  const [deletingQuotation, setDeletingQuotation] =
    useState<Quotation | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  const [
    statusActionLoadingId,
    setStatusActionLoadingId,
  ] = useState<string | null>(null);

  const {
    quotations,
    loading,
    error,
    createQuotation,
    updateQuotation,
    updateQuotationStatus,
    deleteQuotation,
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
    }, [quotations, filter]);

  function statusCount(
    status: FilterStatus
  ) {
    if (status === "All") {
      return quotations.length;
    }

    return quotations.filter(
      (quotation) =>
        quotation.status === status
    ).length;
  }

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

      validUntil:
        data.validUntil || null,

      discount:
        Number(data.discount),

      tax:
        Number(data.tax),

      notes: data.notes,

      items: data.items.map(
        (item) => {
          const quantity =
            Number(item.quantity);

          const unitPrice =
            Number(item.unitPrice);

          return {
            description:
              item.description,
            quantity,
            unitPrice,
            amount:
              quantity * unitPrice,
          };
        }
      ),
    });
  }

  async function handleStatusChange(
    quotation: Quotation,
    status: QuotationStatus
  ) {
    try {
      setStatusActionLoadingId(
        quotation.id
      );

      await updateQuotationStatus(
        quotation.id,
        status
      );
    } catch (err) {
      /*
       * The hook stores the error so it is
       * displayed by the page.
       *
       * We intentionally do not close or
       * modify any dialogs here.
       */
    } finally {
      setStatusActionLoadingId(null);
    }
  }

  function handleViewQuotation(
    quotation: Quotation
  ) {
    setSelectedQuotation(
      quotation
    );
  }

  function handleViewDialogChange(
    open: boolean
  ) {
    if (!open) {
      setSelectedQuotation(null);
    }
  }

  function handleEditQuotation(
    quotation: Quotation
  ) {
    setEditingQuotation(
      quotation
    );
  }

  function handleEditDialogChange(
    open: boolean
  ) {
    if (!open) {
      setEditingQuotation(null);
    }
  }

  async function handleUpdateQuotation(
    id: string,
    data: QuotationFormValues
  ) {
    await updateQuotation(id, {
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

      validUntil:
        data.validUntil || null,

      discount:
        Number(data.discount),

      tax:
        Number(data.tax),

      notes: data.notes,

      items: data.items.map(
        (item) => {
          const quantity =
            Number(item.quantity);

          const unitPrice =
            Number(item.unitPrice);

          return {
            id: item.id,
            description:
              item.description,
            quantity,
            unitPrice,
            amount:
              quantity * unitPrice,
          };
        }
      ),
    });
  }

  function handleDeleteQuotation(
    quotation: Quotation
  ) {
    setDeletingQuotation(
      quotation
    );
  }

  function handleDeleteDialogChange(
    open: boolean
  ) {
    if (!open && !deleting) {
      setDeletingQuotation(null);
    }
  }

  async function handleConfirmDelete() {
    if (!deletingQuotation) {
      return;
    }

    try {
      setDeleting(true);

      await deleteQuotation(
        deletingQuotation.id
      );

      setDeletingQuotation(null);
    } finally {
      setDeleting(false);
    }
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
        onOpenChange={setDialogOpen}
        onSave={handleCreateQuotation}
      />

      <QuotationViewDialog
        quotation={selectedQuotation}
        open={
          selectedQuotation !== null
        }
        onOpenChange={
          handleViewDialogChange
        }
      />

      <QuotationEditDialog
        quotation={editingQuotation}
        open={
          editingQuotation !== null
        }
        onOpenChange={
          handleEditDialogChange
        }
        onSave={handleUpdateQuotation}
      />

      <QuotationDeleteDialog
        quotation={deletingQuotation}
        open={
          deletingQuotation !== null
        }
        onOpenChange={
          handleDeleteDialogChange
        }
        onConfirm={
          handleConfirmDelete
        }
        deleting={deleting}
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
                  {statusCount(status)}
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

      {!loading && !error && (
        <QuotationTable
          quotations={
            filteredQuotations
          }
          onView={
            handleViewQuotation
          }
          onEdit={
            handleEditQuotation
          }
          onDelete={
            handleDeleteQuotation
          }
          onStatusChange={
            handleStatusChange
          }
          statusActionLoadingId={
            statusActionLoadingId
          }
        />
      )}
    </PageContainer>
  );
}
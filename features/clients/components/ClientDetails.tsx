"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

import { Client } from "../types";
import { useClient360 } from "../hooks/useClient360";

import { EventDialog } from "@/features/events/components/EventDialog";
import { createEvent } from "@/features/events/services/event.service";
import type { EventFormValues } from "@/features/events/validation";

import { QuotationDialog } from "@/features/quotations/components/QuotationDialog";
import { createQuotation } from "@/features/quotations/services/quotation.service";
import type { QuotationFormValues } from "@/features/quotations/types";

import { PaymentDialog } from "@/features/payments/components/PaymentDialog";
import { createPayment } from "@/features/payments/services/payment.service";
import type { PaymentFormValues } from "@/features/payments/types";

interface ClientDetailsProps {
  client: Client;

  onEdit?: () => void;

  onDelete?: (
    id: string
  ) => Promise<void>;
}

export function ClientDetails({
  client,
  onEdit,
  onDelete,
}: ClientDetailsProps) {
  const [confirmDelete, setConfirmDelete] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [eventDialogOpen, setEventDialogOpen] =
    useState(false);

  const [quotationDialogOpen, setQuotationDialogOpen] =
    useState(false);

  const [paymentDialogOpen, setPaymentDialogOpen] =
    useState(false);

  const {
    data,
    loading,
    error,
    refresh,
  } = useClient360(client.id);

  const eventInitialValues =
    useMemo<Partial<EventFormValues>>(
      () => ({
        eventName: "",
        clientId: client.id,
        eventType: "",
        eventDate: "",
        venue: "",
        guestCount: "",
      }),
      [client.id]
    );

  const quotationInitialValues =
    useMemo<QuotationFormValues>(
      () => ({
        clientId: client.id,
        eventId: "",
        quotationDate:
          new Date()
            .toISOString()
            .split("T")[0],
        validUntil: "",
        discount: "0",
        tax: "0",
        notes: "",
        items: [
          {
            description: "",
            quantity: "1",
            unitPrice: "0",
          },
        ],
      }),
      [client.id]
    );

  const paymentInitialValues =
    useMemo<PaymentFormValues>(
      () => ({
        clientId: client.id,
        eventId: "",
        quotationId: "",
        paymentDate:
          new Date()
            .toISOString()
            .split("T")[0],
        amount: "",
        paymentMethod: "Cash",
        referenceNumber: "",
        notes: "",
      }),
      [client.id]
    );

  async function handleDelete() {
    if (!onDelete) return;

    setDeleting(true);

    try {
      await onDelete(client.id);
    } finally {
      setDeleting(false);
    }
  }

  async function handleCreateEvent(
    formData: EventFormValues
  ) {
    await createEvent({
      eventName:
        formData.eventName,

      clientId:
        formData.clientId,

      eventType:
        formData.eventType,

      eventDate:
        formData.eventDate,

      venue:
        formData.venue,

      guestCount:
        Number(formData.guestCount),

      status: "Upcoming",
    });

    await refresh();
  }

  async function handleCreateQuotation(
    formData: QuotationFormValues
  ) {
    await createQuotation({
      clientId:
        formData.clientId,

      eventId:
        formData.eventId || null,

      quotationDate:
        formData.quotationDate,

      validUntil:
        formData.validUntil || null,

      discount:
        Number(formData.discount),

      tax:
        Number(formData.tax),

      notes:
        formData.notes,

      items:
        formData.items.map(
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
                quantity *
                unitPrice,
            };
          }
        ),
    });

    await refresh();
  }

  async function handleCreatePayment(
    formData: PaymentFormValues
  ) {
    await createPayment({
      clientId:
        formData.clientId,

      eventId:
        formData.eventId || null,

      quotationId:
        formData.quotationId || null,

      paymentDate:
        formData.paymentDate,

      amount:
        Number(formData.amount),

      paymentMethod:
        formData.paymentMethod,

      referenceNumber:
        formData.referenceNumber,

      notes:
        formData.notes,
    });

    await refresh();
  }

  return (
    <div className="space-y-8">
      {/* Client identity */}

      <div>
        <h2 className="text-2xl font-bold">
          {client.name}
        </h2>

        <p className="text-slate-500">
          {client.phone ||
            "No phone number"}
        </p>
      </div>

      {/* Client information */}

      <div className="space-y-3">
        <Info
          label="Email"
          value={
            client.email ||
            "No email added"
          }
        />

        <Info
          label="Address"
          value={
            client.address ||
            "No address added"
          }
        />

        <Info
          label="Notes"
          value={
            client.notes ||
            "No notes added"
          }
        />
      </div>

      {/* Client 360 */}

      <section className="space-y-4 border-t pt-6">
        <div>
          <h3 className="text-lg font-semibold">
            Business Overview
          </h3>

          <p className="text-sm text-slate-500">
            A snapshot of this client's
            business activity.
          </p>
        </div>

        {loading && (
          <div className="rounded-xl border p-4">
            <p className="text-sm text-slate-500">
              Loading client activity...
            </p>
          </div>
        )}

        {error && (
          <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <div>
              <p className="font-semibold text-red-900">
                Could not load client activity
              </p>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                void refresh()
              }
            >
              Try Again
            </Button>
          </div>
        )}

        {data && !loading && (
          <>
            <SummaryGrid
              totalQuoted={
                data.summary.totalQuoted
              }
              totalReceived={
                data.summary.totalReceived
              }
              remaining={
                data.summary.remaining
              }
              overpaid={
                data.summary.overpaid
              }
              unallocated={
                data.summary.unallocated
              }
            />

            <RelationshipCounts
              eventCount={
                data.summary.eventCount
              }
              quotationCount={
                data.summary.quotationCount
              }
              paymentCount={
                data.summary.paymentCount
              }
            />

            <ClientActivity
              events={data.events}
              quotations={
                data.quotations
              }
              payments={data.payments}
            />
          </>
        )}
      </section>

      {/* Client 360 quick actions */}

      <section className="space-y-3 border-t pt-6">
        <div>
          <h3 className="text-lg font-semibold">
            Quick Actions
          </h3>

          <p className="text-sm text-slate-500">
            Create related records directly
            from this client.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Button
            type="button"
            onClick={() =>
              setEventDialogOpen(true)
            }
          >
            + Create Event
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setQuotationDialogOpen(
                true
              )
            }
          >
            + Create Quotation
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setPaymentDialogOpen(true)
            }
          >
            + Record Payment
          </Button>
        </div>
      </section>

      {/* Existing client actions */}

      {!confirmDelete ? (
        <div className="flex justify-end gap-3 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onEdit}
          >
            Edit Client
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={() =>
              setConfirmDelete(true)
            }
          >
            Delete Client
          </Button>
        </div>
      ) : (
        <div className="space-y-4 rounded-xl border border-red-200 bg-red-50 p-4">
          <div>
            <p className="font-semibold text-red-900">
              Delete this client?
            </p>

            <p className="mt-1 text-sm text-red-700">
              This action cannot be undone.
              The client will be permanently
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
                : "Yes, Delete Client"}
            </Button>
          </div>
        </div>
      )}

      {/* Quick-action dialogs */}

      <EventDialog
        open={eventDialogOpen}
        onOpenChange={
          setEventDialogOpen
        }
        initialValues={
          eventInitialValues
        }
        showTrigger={false}
        onCreateEvent={
          handleCreateEvent
        }
      />

      <QuotationDialog
        open={
          quotationDialogOpen
        }
        onOpenChange={
          setQuotationDialogOpen
        }
        initialValues={
          quotationInitialValues
        }
        onSave={
          handleCreateQuotation
        }
      />

      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={
          setPaymentDialogOpen
        }
        initialValues={
          paymentInitialValues
        }
        onSave={
          handleCreatePayment
        }
      />
    </div>
  );
}

interface SummaryGridProps {
  totalQuoted: number;
  totalReceived: number;
  remaining: number;
  overpaid: number;
  unallocated: number;
}

function SummaryGrid({
  totalQuoted,
  totalReceived,
  remaining,
  overpaid,
  unallocated,
}: SummaryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <SummaryCard
        label="Total Quoted"
        value={formatCurrency(
          totalQuoted
        )}
      />

      <SummaryCard
        label="Received"
        value={formatCurrency(
          totalReceived
        )}
      />

      <SummaryCard
        label="Remaining"
        value={formatCurrency(
          remaining
        )}
      />

      <SummaryCard
        label="Overpaid"
        value={formatCurrency(
          overpaid
        )}
      />

      <SummaryCard
        label="Unallocated"
        value={formatCurrency(
          unallocated
        )}
      />
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
}

function SummaryCard({
  label,
  value,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold">
        {value}
      </p>
    </div>
  );
}

interface RelationshipCountsProps {
  eventCount: number;
  quotationCount: number;
  paymentCount: number;
}

function RelationshipCounts({
  eventCount,
  quotationCount,
  paymentCount,
}: RelationshipCountsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <CountCard
        label="Events"
        value={eventCount}
      />

      <CountCard
        label="Quotations"
        value={quotationCount}
      />

      <CountCard
        label="Payments"
        value={paymentCount}
      />
    </div>
  );
}

interface CountCardProps {
  label: string;
  value: number;
}

function CountCard({
  label,
  value,
}: CountCardProps) {
  return (
    <div className="rounded-xl border p-3 text-center">
      <p className="text-xl font-bold">
        {value}
      </p>

      <p className="text-xs text-slate-500">
        {label}
      </p>
    </div>
  );
}

interface ClientActivityProps {
  events: {
    id: string;
    eventName: string;
    eventType: string;
    eventDate: string;
    venue: string;
    status: string;
  }[];

  quotations: {
    id: string;
    quotationNumber: string;
    total: number;
    status: string;
    quotationDate: string;
  }[];

  payments: {
    id: string;
    paymentNumber: string;
    paymentDate: string;
    amount: number;
    paymentMethod: string;
    quotationNumber: string | null;
  }[];
}

function ClientActivity({
  events,
  quotations,
  payments,
}: ClientActivityProps) {
  return (
    <div className="space-y-6">
      <ActivitySection
        title="Events"
        emptyText="No events linked to this client."
        hasItems={
          events.length > 0
        }
      >
        {events.map((event) => (
          <div
            key={event.id}
            className="rounded-xl border p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">
                  {event.eventName}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {event.eventType}
                  {event.venue
                    ? ` · ${event.venue}`
                    : ""}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {formatDate(
                    event.eventDate
                  )}
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                {event.status}
              </span>
            </div>
          </div>
        ))}
      </ActivitySection>

      <ActivitySection
        title="Quotations"
        emptyText="No quotations linked to this client."
        hasItems={
          quotations.length > 0
        }
      >
        {quotations.map(
          (quotation) => (
            <div
              key={quotation.id}
              className="flex items-center justify-between gap-4 rounded-xl border p-4"
            >
              <div>
                <p className="font-semibold">
                  {
                    quotation.quotationNumber
                  }
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {formatDate(
                    quotation.quotationDate
                  )}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  {formatCurrency(
                    quotation.total
                  )}
                </p>

                <p className="text-xs text-slate-500">
                  {quotation.status}
                </p>
              </div>
            </div>
          )
        )}
      </ActivitySection>

      <ActivitySection
        title="Payments"
        emptyText="No payments linked to this client."
        hasItems={
          payments.length > 0
        }
      >
        {payments.map(
          (payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between gap-4 rounded-xl border p-4"
            >
              <div>
                <p className="font-semibold">
                  {payment.paymentNumber}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {formatDate(
                    payment.paymentDate
                  )}
                  {" · "}
                  {
                    payment.paymentMethod
                  }
                </p>

                {payment.quotationNumber && (
                  <p className="mt-1 text-xs text-slate-500">
                    {
                      payment.quotationNumber
                    }
                  </p>
                )}
              </div>

              <p className="font-semibold">
                {formatCurrency(
                  payment.amount
                )}
              </p>
            </div>
          )
        )}
      </ActivitySection>
    </div>
  );
}

interface ActivitySectionProps {
  title: string;
  emptyText: string;
  hasItems: boolean;
  children: React.ReactNode;
}

function ActivitySection({
  title,
  emptyText,
  hasItems,
  children,
}: ActivitySectionProps) {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold">
        {title}
      </h4>

      {hasItems ? (
        children
      ) : (
        <p className="rounded-xl border border-dashed p-4 text-sm text-slate-500">
          {emptyText}
        </p>
      )}
    </div>
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

function formatCurrency(
  amount: number
): string {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(amount);
}

function formatDate(
  value: string
): string {
  if (!value) return "No date";

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(
    new Date(`${value}T00:00:00`)
  );
}
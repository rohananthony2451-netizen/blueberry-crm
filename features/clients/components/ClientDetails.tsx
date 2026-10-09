"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Eye,
  FileText,
  Mail,
  MapPin,
  Phone,
  Plus,
  Receipt,
  Trash2,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Client } from "../types";
import { useClient360 } from "../hooks/useClient360";

import { EventDialog } from "@/features/events/components/EventDialog";
import { createEvent } from "@/features/events/services/event.service";
import type { EventFormValues } from "@/features/events/validation";

import { QuotationDialog } from "@/features/quotations/components/QuotationDialog";
import { createQuotation } from "@/features/quotations/services/quotation.service";
import type { QuotationFormValues } from "@/features/quotations/types";
import { QuotationViewDialog } from "@/features/quotations/components/QuotationViewDialog";
import type { Quotation } from "@/features/quotations/types";

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


    const [quotationViewOpen, setQuotationViewOpen] =
  useState(false);

const [selectedQuotation, setSelectedQuotation] =
  useState<Quotation | null>(null);

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
        leadId: "",

        prospectName: client.name,
        prospectPhone: client.phone,
        prospectEmail: client.email,
        prospectAddress: client.address,

        eventName: "",
        eventType: "",
        eventDate: "",
        venue: "",
        guestCount: "",

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
            ourExpense: false,
          },
        ],
      }),
      [
        client.id,
        client.name,
        client.phone,
        client.email,
        client.address,
      ]
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

    function handleViewQuotation(
  quotation: Quotation
) {
  setSelectedQuotation(quotation);
  setQuotationViewOpen(true);
}

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
      eventName: formData.eventName,
      clientId: formData.clientId,
      eventType: formData.eventType,
      eventDate: formData.eventDate,
      venue: formData.venue,
      guestCount: Number(formData.guestCount),
      status: "Upcoming",
    });

    await refresh();
  }

  async function handleCreateQuotation(
    formData: QuotationFormValues
  ) {
    await createQuotation({
      clientId: formData.clientId,
      leadId: formData.leadId,

      prospectName:
        formData.prospectName,

      prospectPhone:
        formData.prospectPhone,

      prospectEmail:
        formData.prospectEmail,

      prospectAddress:
        formData.prospectAddress,

      eventName:
        formData.eventName,

      eventType:
        formData.eventType,

      eventDate:
        formData.eventDate,

      venue:
        formData.venue,

      guestCount:
        Number(formData.guestCount),

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
        formData.items.map((item) => {
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

            ourExpense:
              item.ourExpense,
          };
        }),
    });

    await refresh();
  }

  async function handleCreatePayment(
    formData: PaymentFormValues
  ) {
    await createPayment({
      clientId: formData.clientId,
      eventId: formData.eventId || null,
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
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <header className="border-b border-slate-200 px-6 py-7 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Client workspace
            </p>

            <h2 className="mt-2 truncate text-3xl font-semibold tracking-tight text-slate-950">
              {client.name}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              {client.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={14} />
                  {client.phone}
                </span>
              )}

              {client.email && (
                <span className="inline-flex items-center gap-1.5">
                  <Mail size={14} />
                  {client.email}
                </span>
              )}
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onEdit}
            className="shrink-0"
          >
            Edit Client
          </Button>
        </div>
      </header>

      <div className="space-y-8 px-6 py-7 sm:px-8 lg:px-10">
        {/* Business snapshot */}
        <section>
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-950">
              Business snapshot
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Everything you need to know about this client at a glance.
            </p>
          </div>

          {loading ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-24 animate-pulse rounded-2xl bg-slate-100"
                  />
                )
              )}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="font-medium text-red-900">
                Could not load client activity
              </p>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>

              <Button
                type="button"
                variant="outline"
                onClick={() => void refresh()}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : data ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Events"
                value={String(
                  data.summary.eventCount
                )}
                icon={CalendarDays}
              />

              <MetricCard
                label="Total quoted"
                value={formatCurrency(
                  data.summary.totalQuoted
                )}
                icon={FileText}
              />

              <MetricCard
                label="Received"
                value={formatCurrency(
                  data.summary.totalReceived
                )}
                icon={Wallet}
              />

              <MetricCard
                label="Outstanding"
                value={formatCurrency(
                  data.summary.remaining
                )}
                icon={CreditCard}
              />
            </div>
          ) : null}
        </section>

        {/* Quick actions */}
        <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-slate-950">
                Quick actions
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Add something to this client's workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={() =>
                  setEventDialogOpen(true)
                }
              >
                <Plus size={16} />
                Event
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setQuotationDialogOpen(true)
                }
              >
                <FileText size={16} />
                Quotation
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setPaymentDialogOpen(true)
                }
              >
                <Wallet size={16} />
                Payment
              </Button>
            </div>
          </div>
        </section>

        {/* Events */}
        <section>
          <SectionHeading
            title="Events"
            description="Every event connected to this client."
            action={
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setEventDialogOpen(true)
                }
              >
                <Plus size={16} />
                Add Event
              </Button>
            }
          />

          {loading ? (
            <LoadingList />
          ) : data?.events.length ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="hidden grid-cols-[1fr_140px_140px_120px] gap-4 border-b bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 md:grid">
                <span>Event</span>
                <span>Date</span>
                <span>Venue</span>
                <span>Status</span>
              </div>

              <div className="divide-y divide-slate-100">
                {data.events.map((event) => (
                  <div
                    key={event.id}
                    className="grid gap-3 px-5 py-4 transition-colors hover:bg-slate-50 md:grid-cols-[1fr_140px_140px_120px] md:items-center md:gap-4"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-950">
                        {event.eventName}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {event.eventType}
                      </p>
                    </div>

                    <div className="text-sm text-slate-600">
                      {formatDate(event.eventDate)}
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <MapPin size={14} />
                      <span className="truncate">
                        {event.venue || "No venue"}
                      </span>
                    </div>

                    <StatusPill
                      status={event.status}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="No events yet"
              description="Create the first event for this client."
              actionLabel="Create Event"
              onAction={() =>
                setEventDialogOpen(true)
              }
            />
          )}
        </section>

        {/* Quotations */}
        <section>
          <SectionHeading
            title="Quotations"
            description="Quotes created for this client."
            action={
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setQuotationDialogOpen(true)
                }
              >
                <Plus size={16} />
                New Quotation
              </Button>
            }
          />

          {loading ? (
            <LoadingList />
          ) : data?.quotations.length ? (
            <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200">
             {data.quotations.map((quotation) => (
  <button
    key={quotation.id}
    type="button"
    onClick={() =>
      handleViewQuotation(quotation)
    }
    className="group flex w-full flex-col gap-3 px-5 py-4 text-left transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
  >
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <p className="font-semibold text-slate-950">
          {quotation.quotationNumber}
        </p>

        <Eye
          size={15}
          className="text-slate-400 opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>

      <p className="mt-1 text-sm text-slate-500">
        {quotation.eventName ||
          quotation.proposedEventName ||
          "No event linked"}
        {" · "}
        {formatDate(
          quotation.quotationDate
        )}
      </p>
    </div>

    <div className="flex items-center gap-4">
      <p className="font-semibold text-slate-950">
        {formatCurrency(
          quotation.total
        )}
      </p>

      <StatusPill
        status={quotation.status}
      />
    </div>
  </button>
))}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No quotations yet"
              description="Create a quotation for this client."
              actionLabel="Create Quotation"
              onAction={() =>
                setQuotationDialogOpen(true)
              }
            />
          )}
        </section>

        {/* Payments */}
        <section>
          <SectionHeading
            title="Payments"
            description="Payment activity for this client."
            action={
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setPaymentDialogOpen(true)
                }
              >
                <Plus size={16} />
                Record Payment
              </Button>
            }
          />

          {loading ? (
            <LoadingList />
          ) : data?.payments.length ? (
            <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200">
              {data.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-950">
                      {payment.paymentNumber}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {formatDate(
                        payment.paymentDate
                      )}
                      {" · "}
                      {payment.paymentMethod}
                    </p>

                    {payment.quotationNumber && (
                      <p className="mt-1 text-xs text-slate-400">
                        {payment.quotationNumber}
                      </p>
                    )}
                  </div>

                  <p className="font-semibold text-emerald-700">
                    {formatCurrency(
                      payment.amount
                    )}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Receipt}
              title="No payments yet"
              description="Record the first payment for this client."
              actionLabel="Record Payment"
              onAction={() =>
                setPaymentDialogOpen(true)
              }
            />
          )}
        </section>

        {/* Client information */}
        <section>
          <SectionHeading
            title="Client information"
            description="Contact and additional information."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard
              icon={Phone}
              label="Phone"
              value={
                client.phone || "Not provided"
              }
            />

            <InfoCard
              icon={Mail}
              label="Email"
              value={
                client.email || "Not provided"
              }
            />

            <InfoCard
              icon={MapPin}
              label="Address"
              value={
                client.address || "Not provided"
              }
            />

            <InfoCard
              icon={FileText}
              label="Notes"
              value={
                client.notes || "No notes added"
              }
            />
          </div>
        </section>

        {/* Danger zone */}
        <section className="border-t border-slate-200 pt-8">
          {!confirmDelete ? (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  setConfirmDelete(true)
                }
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 size={16} />
                Delete Client
              </Button>
            </div>
          ) : (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <div>
                <p className="font-semibold text-red-950">
                  Delete this client?
                </p>

                <p className="mt-1 text-sm text-red-700">
                  This action cannot be undone. The client
                  will be permanently removed from your
                  workspace.
                </p>
              </div>

              <div className="mt-4 flex justify-end gap-2">
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
                    : "Delete Client"}
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>

      <EventDialog
        open={eventDialogOpen}
        onOpenChange={setEventDialogOpen}
        initialValues={eventInitialValues}
        showTrigger={false}
        onCreateEvent={handleCreateEvent}
      />

      <QuotationDialog
        open={quotationDialogOpen}
        onOpenChange={setQuotationDialogOpen}
        initialValues={quotationInitialValues}
        onSave={handleCreateQuotation}
      />

      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        initialValues={paymentInitialValues}
        onSave={handleCreatePayment}
      />

<QuotationViewDialog
  quotation={selectedQuotation}
  open={quotationViewOpen}
  onOpenChange={(open) => {
    setQuotationViewOpen(open);

    if (!open) {
      setSelectedQuotation(null);
    }
  }}
/>

    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
}

function MetricCard({
  label,
  value,
  icon: Icon,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Icon size={17} />
        </div>
      </div>
    </div>
  );
}

interface SectionHeadingProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

function SectionHeading({
  title,
  description,
  action,
}: SectionHeadingProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h3 className="text-lg font-semibold tracking-tight text-slate-950">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      {action}
    </div>
  );
}

interface StatusPillProps {
  status: string;
}

function StatusPill({
  status,
}: StatusPillProps) {
  const normalized =
    status.toLowerCase();

  const className =
    normalized.includes("complete") ||
    normalized.includes("paid") ||
    normalized.includes("accept")
      ? "bg-emerald-50 text-emerald-700"
      : normalized.includes("cancel") ||
          normalized.includes("reject")
        ? "bg-red-50 text-red-700"
        : "bg-blue-50 text-blue-700";

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

interface InfoCardProps {
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  label: string;
  value: string;
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <Icon size={16} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-medium text-slate-800">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        <Icon size={18} />
      </div>

      <p className="mt-3 font-semibold text-slate-950">
        {title}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>

      <Button
        type="button"
        variant="outline"
        onClick={onAction}
        className="mt-4"
      >
        {actionLabel}
      </Button>
    </div>
  );
}

function LoadingList() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map(
        (_, index) => (
          <div
            key={index}
            className="h-[60px] animate-pulse rounded-2xl bg-slate-100"
          />
        )
      )}
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
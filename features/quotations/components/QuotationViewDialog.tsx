"use client";

import {
  CalendarDays,
  FileDown,
  MessageCircle,
  UserRound,
  MapPin,
  ReceiptText,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { QuotationStatusBadge } from "./QuotationStatusBadge";

import type { Quotation } from "../types";

interface QuotationViewDialogProps {
  quotation: Quotation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function QuotationViewDialog({
  quotation,
  open,
  onOpenChange,
}: QuotationViewDialogProps) {
  if (!quotation) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto p-0 sm:max-w-4xl">
        <div className="border-b border-slate-200 bg-white px-6 py-5 sm:px-8">
          <DialogHeader>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Quotation
                </p>

                <DialogTitle className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                  {quotation.quotationNumber}
                </DialogTitle>

                <DialogDescription className="mt-1">
                  Review the quotation details before sharing it with the
                  client.
                </DialogDescription>
              </div>

              <QuotationStatusBadge status={quotation.status} />
            </div>
          </DialogHeader>
        </div>

        <div className="space-y-7 bg-white px-6 py-6 sm:px-8">
          {/* Client + Event */}
          <section className="grid gap-4 sm:grid-cols-2">
            <InfoBlock
              icon={UserRound}
              label="Client"
              value={quotation.clientName || quotation.prospectName}
              secondary={
                quotation.prospectPhone ||
                quotation.prospectEmail ||
                undefined
              }
            />

            <InfoBlock
              icon={ReceiptText}
              label="Event"
              value={
                quotation.eventName ||
                quotation.proposedEventName ||
                "No event linked"
              }
              secondary={
                quotation.proposedEventType ||
                quotation.proposedVenue ||
                undefined
              }
            />
          </section>

          {/* Event details */}
          <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
            <div className="mb-4">
              <p className="text-sm font-semibold text-slate-950">
                Event details
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Information included with this quotation.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetailItem
                icon={CalendarDays}
                label="Event date"
                value={formatDate(quotation.proposedEventDate)}
              />

              <DetailItem
                icon={MapPin}
                label="Venue"
                value={quotation.proposedVenue || "Not specified"}
              />

              <DetailItem
                label="Guests"
                value={
                  quotation.proposedGuestCount
                    ? String(quotation.proposedGuestCount)
                    : "Not specified"
                }
              />

              <DetailItem
                label="Quotation date"
                value={formatDate(quotation.quotationDate)}
              />
            </div>

            {quotation.validUntil && (
              <div className="mt-4 border-t border-slate-200 pt-4">
                <DetailItem
                  label="Valid until"
                  value={formatDate(quotation.validUntil)}
                />
              </div>
            )}

            <div className="mt-4 border-t border-slate-200 pt-4">
  <div className="grid gap-4 sm:grid-cols-2">
    <DetailItem
      label="Created"
      value={formatDateTime(quotation.createdAt)}
    />

    <DetailItem
      label="Last updated"
      value={formatDateTime(quotation.updatedAt)}
    />
  </div>
</div>
          </section>
          

          {/* Line items */}
          <section>
            <div className="mb-4">
              <p className="text-sm font-semibold text-slate-950">
                Quotation items
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Services and items included in this quotation.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Description
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Qty
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Unit price
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Amount
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {quotation.items.length ? (
                      quotation.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-5 py-4 text-slate-700">
                            <div className="font-medium text-slate-900">
                              {item.description}
                            </div>

                            {item.ourExpense && (
                              <div className="mt-1 text-xs text-slate-400">
                                Internal expense
                              </div>
                            )}
                          </td>

                          <td className="px-5 py-4 text-right text-slate-700">
                            {item.quantity}
                          </td>

                          <td className="px-5 py-4 text-right text-slate-700">
                            {formatCurrency(item.unitPrice)}
                          </td>

                          <td className="px-5 py-4 text-right font-medium text-slate-900">
                            {formatCurrency(item.amount)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-5 py-8 text-center text-sm text-slate-500"
                        >
                          No quotation items added.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Financial summary */}
          <section className="flex justify-end">
            <div className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:max-w-sm">
              <div className="space-y-3 text-sm">
                <SummaryRow
                  label="Subtotal"
                  value={formatCurrency(quotation.subtotal)}
                />

                <SummaryRow
                  label="Discount"
                  value={`− ${formatCurrency(quotation.discount)}`}
                />

                <SummaryRow
                  label="Tax"
                  value={`+ ${formatCurrency(quotation.tax)}`}
                />

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-base font-semibold text-slate-950">
                      Total
                    </span>

                    <span className="text-xl font-bold tracking-tight text-slate-950">
                      {formatCurrency(quotation.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Notes */}
          {quotation.notes && (
            <section>
              <p className="mb-2 text-sm font-semibold text-slate-950">
                Notes
              </p>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600">
                {quotation.notes}
              </div>
            </section>
          )}

          {/* Future actions */}
          <section className="border-t border-slate-200 pt-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Share quotation
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  PDF and WhatsApp sharing will be added in the quotation
                  document sprint.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled
                  title="PDF generation will be added in a dedicated sprint."
                >
                  <FileDown size={16} />
                  Download PDF
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  disabled
                  title="WhatsApp sharing will be added with the quotation document workflow."
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </Button>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface InfoBlockProps {
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  label: string;
  value: string;
  secondary?: string;
}

function InfoBlock({
  icon: Icon,
  label,
  value,
  secondary,
}: InfoBlockProps) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <Icon size={17} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 truncate font-semibold text-slate-950">
            {value}
          </p>

          {secondary && (
            <p className="mt-1 truncate text-sm text-slate-500">
              {secondary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
  icon?: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
}

function DetailItem({
  label,
  value,
  icon: Icon,
}: DetailItemProps) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
        {Icon && <Icon size={13} />}
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-800">
        {value}
      </p>
    </div>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
}

function SummaryRow({
  label,
  value,
}: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-600">{label}</span>

      <span className="font-medium text-slate-900">
        {value}
      </span>
    </div>
  );
}
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  QuotationStatusBadge,
} from "./QuotationStatusBadge";

import type {
  Quotation,
} from "../types";

interface QuotationViewDialogProps {
  quotation: Quotation | null;
  open: boolean;
  onOpenChange: (
    open: boolean
  ) => void;
}

function formatDate(
  value: string | null
) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(new Date(value));
}

function formatCurrency(
  value: number
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(value);
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
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4 pr-8">
            <div>
              <DialogTitle className="text-xl">
                {quotation.quotationNumber}
              </DialogTitle>

              <DialogDescription className="mt-1">
                Quotation details and line items.
              </DialogDescription>
            </div>

            <QuotationStatusBadge
              status={quotation.status}
            />
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4 rounded-xl border bg-slate-50 p-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Client
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {quotation.clientName}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Event
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {quotation.eventName ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Quotation Date
              </p>

              <p className="mt-1 text-slate-700">
                {formatDate(
                  quotation.quotationDate
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Valid Until
              </p>

              <p className="mt-1 text-slate-700">
                {formatDate(
                  quotation.validUntil
                )}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Line Items
            </h3>

            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Description
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Qty
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Unit Price
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {quotation.items.map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="border-t"
                      >
                        <td className="px-4 py-3 text-slate-700">
                          {item.description}
                        </td>

                        <td className="px-4 py-3 text-right text-slate-700">
                          {item.quantity}
                        </td>

                        <td className="px-4 py-3 text-right text-slate-700">
                          {formatCurrency(
                            item.unitPrice
                          )}
                        </td>

                        <td className="px-4 py-3 text-right font-medium text-slate-900">
                          {formatCurrency(
                            item.amount
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="ml-auto w-full max-w-sm rounded-xl border bg-slate-50 p-5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">
                Subtotal
              </span>

              <span className="font-medium">
                {formatCurrency(
                  quotation.subtotal
                )}
              </span>
            </div>

            <div className="mt-2 flex justify-between text-sm">
              <span className="text-slate-600">
                Discount
              </span>

              <span className="font-medium">
                −{" "}
                {formatCurrency(
                  quotation.discount
                )}
              </span>
            </div>

            <div className="mt-2 flex justify-between text-sm">
              <span className="text-slate-600">
                Tax
              </span>

              <span className="font-medium">
                +{" "}
                {formatCurrency(
                  quotation.tax
                )}
              </span>
            </div>

            <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
              <span>Total</span>

              <span>
                {formatCurrency(
                  quotation.total
                )}
              </span>
            </div>
          </div>

          {quotation.notes && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-900">
                Notes
              </h3>

              <div className="rounded-xl border p-4 text-sm leading-6 text-slate-600">
                {quotation.notes}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
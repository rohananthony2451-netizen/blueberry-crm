"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  getPendingPayments,
} from "../services/payment.service";

import type {
  PendingPaymentItem,
} from "../types";

interface PendingPaymentsDialogProps {
  open: boolean;
  onOpenChange: (
    open: boolean
  ) => void;
}

function formatCurrency(
  value: number
) {
  return `₹${value.toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  )}`;
}

export function PendingPaymentsDialog({
  open,
  onOpenChange,
}: PendingPaymentsDialogProps) {
  const [
    items,
    setItems,
  ] = useState<
    PendingPaymentItem[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    async function loadPending() {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getPendingPayments();

        if (!cancelled) {
          setItems(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load pending payments."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPending();

    return () => {
      cancelled = true;
    };
  }, [open]);

  const totalPending =
    items.reduce(
      (sum, item) =>
        sum +
        item.remainingAmount,
      0
    );

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Pending Collections
          </DialogTitle>

          <DialogDescription>
            Active quotations with an outstanding balance.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Loading pending collections...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border bg-muted/40 p-6 text-center">
            <p className="font-medium">
              No pending collections
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              All active quotations are currently fully paid.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(
              (item) => (
                <div
                  key={
                    item.quotationId
                  }
                  className="rounded-xl border p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">
                        {item.clientName}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {
                          item.quotationNumber
                        }
                        {item.eventName
                          ? ` • ${item.eventName}`
                          : ""}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.status}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-lg font-semibold">
                        {formatCurrency(
                          item.remainingAmount
                        )}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        remaining
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 border-t pt-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-muted-foreground">
                        Quotation Total
                      </p>

                      <p className="font-medium">
                        {formatCurrency(
                          item.quotationTotal
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">
                        Received
                      </p>

                      <p className="font-medium">
                        {formatCurrency(
                          item.receivedAmount
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}

            <div className="flex items-center justify-between border-t pt-4">
              <span className="font-semibold">
                Total Pending
              </span>

              <span className="text-lg font-bold">
                {formatCurrency(
                  totalPending
                )}
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
"use client";

import {
  AlertTriangle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import type { Payment } from "../types";

interface PaymentDeleteDialogProps {
  payment: Payment | null;
  open: boolean;
  onOpenChange: (
    open: boolean
  ) => void;
  onConfirm: () => Promise<void>;
  deleting?: boolean;
}

export function PaymentDeleteDialog({
  payment,
  open,
  onOpenChange,
  onConfirm,
  deleting = false,
}: PaymentDeleteDialogProps) {
  if (!payment) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle
              size={20}
            />
          </div>

          <DialogTitle>
            Delete Payment
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-slate-900">
              {payment.paymentNumber}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg bg-slate-50 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">
              Client
            </span>

            <span className="font-medium">
              {payment.clientName}
            </span>
          </div>

          <div className="mt-2 flex justify-between">
            <span className="text-slate-500">
              Amount
            </span>

            <span className="font-semibold">
              ₹
              {payment.amount.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
            disabled={deleting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting
              ? "Deleting..."
              : "Delete Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
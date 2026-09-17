"use client";

import {
  AlertTriangle,
  Trash2,
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

import type { Quotation } from "../types";

interface QuotationDeleteDialogProps {
  quotation: Quotation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  deleting?: boolean;
}

export function QuotationDeleteDialog({
  quotation,
  open,
  onOpenChange,
  onConfirm,
  deleting = false,
}: QuotationDeleteDialogProps) {
  if (!quotation) {
    return null;
  }

  async function handleConfirm() {
    await onConfirm();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle size={20} />
          </div>

          <DialogTitle>
            Delete quotation?
          </DialogTitle>

          <DialogDescription>
            You are about to permanently delete{" "}
            <span className="font-medium text-foreground">
              {quotation.quotationNumber}
            </span>
            . This will also delete all of its
            line items.
          </DialogDescription>
        </DialogHeader>

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
            onClick={handleConfirm}
            disabled={deleting}
          >
            <Trash2 size={16} />
            {deleting
              ? "Deleting..."
              : "Delete Quotation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
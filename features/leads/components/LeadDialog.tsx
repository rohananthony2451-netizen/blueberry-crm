"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { LeadForm } from "./LeadForm";
import type { Lead } from "../types";
import type { LeadFormValues } from "../validation";

interface LeadDialogProps {
  onCreateLead: (
    lead: Omit<Lead, "id">
  ) => Promise<Lead>;
  triggerClassName?: string;
}

export function LeadDialog({
  onCreateLead,
  triggerClassName,
}: LeadDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          className={
            triggerClassName ??
            "h-10 rounded-xl bg-blue-600 px-4 font-semibold text-white shadow-sm hover:bg-blue-700"
          }
        >
          <Plus
            className="mr-1.5 h-4 w-4"
            strokeWidth={2.2}
          />
          Add Lead
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Create New Lead
          </DialogTitle>
        </DialogHeader>

        <LeadForm
          onCancel={() => setOpen(false)}
          onSave={async (
            data: LeadFormValues
          ) => {
            await onCreateLead({
              clientName: data.clientName,
              email: data.email,
              phone: data.phone,
              eventType: data.eventType,
              eventDate: data.eventDate,
              budget: data.budget,
              source:
                data.source as Lead["source"],
              status: "New",
              followUpDate:
                data.followUpDate ?? "",
              assignedTo: data.assignedTo,
              notes: data.notes ?? "",
              convertedClientId: null,
            });

            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
"use client";

import { useState } from "react";

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
}

export function LeadDialog({
  onCreateLead,
}: LeadDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>+ New Lead</Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Lead</DialogTitle>
        </DialogHeader>

        <LeadForm
          onCancel={() => setOpen(false)}
          onSave={async (data: LeadFormValues) => {
            await onCreateLead({
              clientName: data.clientName,
              phone: data.phone,
              eventType: data.eventType,
              eventDate: data.eventDate,
              budget: data.budget,
              source: data.source as Lead["source"],
              status: "New",
              assignedTo: data.assignedTo,
              notes: data.notes ?? "",
            });

            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
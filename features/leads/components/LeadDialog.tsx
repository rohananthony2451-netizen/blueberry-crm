"use client";
import type { Lead } from "../types";
import { useState } from "react";
import { useLeadActions } from "../hooks/useLeadActions";
import { Button } from "@/components/ui/button";
import { LeadFormValues } from "../validation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { LeadForm } from "./LeadForm";

export function LeadDialog() {
    const [open, setOpen] = useState(false);

    const {
    createLead,
} = useLeadActions();
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
  await createLead({
    clientName: data.clientName,
    phone: data.phone,
    eventType: data.eventType,
    eventDate: data.eventDate,
    budget: data.budget,
    source: data.source as Lead["source"],
    status: "New",
    assignedTo: "",
    notes: data.notes ?? "",
  });

  setOpen(false);
}}
/>
            </DialogContent>
        </Dialog>
    );
}
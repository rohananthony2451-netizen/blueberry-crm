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

export function LeadDialog() {
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
    onSave={() => {
        console.log("Lead Saved");

        setOpen(false);
    }}
/>
            </DialogContent>
        </Dialog>
    );
}
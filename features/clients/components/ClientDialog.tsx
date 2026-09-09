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

import { ClientForm } from "./ClientForm";
import type { ClientFormValues } from "../validation";

interface ClientDialogProps {
  onCreateClient: (
    client: ClientFormValues
  ) => Promise<unknown>;
}

export function ClientDialog({
  onCreateClient,
}: ClientDialogProps) {
  const [open, setOpen] = useState(false);

  async function handleSave(data: ClientFormValues) {
    await onCreateClient(data);
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>+ New Client</Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Client</DialogTitle>
        </DialogHeader>

        <ClientForm
          onCancel={() => setOpen(false)}
          onSave={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
}
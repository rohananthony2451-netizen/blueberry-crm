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

import type { Client } from "../types";
import type { ClientFormValues } from "../validation";

interface ClientDialogProps {
  onCreateClient: (
    client: Omit<Client, "id" | "createdAt" | "updatedAt">
  ) => Promise<unknown>;
}

export function ClientDialog({
  onCreateClient,
}: ClientDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button type="button">
          + New Client
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Create New Client
          </DialogTitle>
        </DialogHeader>

        <ClientForm
          onCancel={() => setOpen(false)}
          onSave={async (data: ClientFormValues) => {
            await onCreateClient({
              name: data.name,
              phone: data.phone,
              email: data.email,
              address: data.address ?? "",
              notes: data.notes ?? "",
            });

            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
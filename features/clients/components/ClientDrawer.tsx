"use client";

import { useState } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Client } from "../types";
import { ClientDetails } from "./ClientDetails";
import { ClientForm } from "./ClientForm";

import type { ClientFormValues } from "../validation";

interface ClientDrawerProps {
  client: Client;
  children: React.ReactNode;

  onEdit?: (
    id: string,
    data: Partial<Client>
  ) => Promise<void>;

  onDelete?: (
    id: string
  ) => Promise<void>;
}

export function ClientDrawer({
  client,
  children,
  onEdit,
  onDelete,
}: ClientDrawerProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  async function handleEdit(data: ClientFormValues) {
    if (!onEdit) return;

    await onEdit(client.id, {
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address ?? "",
      notes: data.notes ?? "",
    });

    setEditing(false);
  }

  async function handleDelete(id: string) {
    if (!onDelete) return;

    await onDelete(id);
    setOpen(false);
  }

  function handleDrawerChange(value: boolean) {
    setOpen(value);

    if (!value) {
      setEditing(false);
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={handleDrawerChange}
    >
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>

      <DrawerContent className="mx-auto max-h-[92vh] w-full max-w-5xl overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto">
          {editing ? (
            <div className="mx-auto max-w-3xl p-6 sm:p-8 lg:p-10">
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Client
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  Edit Client
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update the information for {client.name}.
                </p>
              </div>

              <ClientForm
                initialValues={{
                  name: client.name,
                  phone: client.phone,
                  email: client.email,
                  address: client.address,
                  notes: client.notes,
                }}
                onCancel={() => setEditing(false)}
                onSave={handleEdit}
                saveText="Save Changes"
              />
            </div>
          ) : (
            <ClientDetails
              client={client}
              onEdit={() => setEditing(true)}
              onDelete={handleDelete}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
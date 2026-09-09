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

  async function handleEdit(
    data: ClientFormValues
  ) {
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

  function handleDrawerChange(
    value: boolean
  ) {
    setOpen(value);

    if (!value) {
      setEditing(false);
    }
  }
async function handleDelete(id: string) {
  if (!onDelete) return;

  await onDelete(id);
  setOpen(false);
}
  return (
    <Drawer
      open={open}
      onOpenChange={handleDrawerChange}
    >
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>

      <DrawerContent className="mx-auto max-h-[90vh] w-full max-w-xl overflow-y-auto p-8">

        {editing ? (
          <div className="space-y-6">

            <div>
              <h2 className="text-2xl font-bold">
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
              onCancel={() =>
                setEditing(false)
              }
              onSave={handleEdit}
              saveText="Save Changes"
            />

          </div>
        ) : (
          <ClientDetails
           client={client}
             onEdit={() => setEditing(true) }
      onDelete={handleDelete}
/>
        )}

      </DrawerContent>
    </Drawer>
  );
}
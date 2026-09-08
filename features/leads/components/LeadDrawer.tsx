"use client";

import { useState } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Lead } from "../types";
import { LeadDetails } from "./LeadDetails";
import { LeadForm } from "./LeadForm";
import type { LeadFormValues } from "../validation";

interface LeadDrawerProps {
  lead: Lead;
  children: React.ReactNode;
  onEdit?: (
    id: string,
    data: Partial<Lead>
  ) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function LeadDrawer({
  lead,
  children,
  onEdit,
  onDelete,
}: LeadDrawerProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  async function handleEdit(data: LeadFormValues) {
    if (!onEdit) return;

    await onEdit(lead.id, {
      clientName: data.clientName,
      phone: data.phone,
      eventType: data.eventType,
      eventDate: data.eventDate,
      budget: data.budget,
      source: data.source as Lead["source"],
      assignedTo: data.assignedTo,
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

      <DrawerContent className="mx-auto max-h-[80vh] w-full max-w-xl overflow-hidden">

  <div className="min-h-0 flex-1 overflow-y-auto p-8">

    {editing ? (
      <div className="space-y-6">

        <div>
          <h2 className="text-2xl font-bold">
            Edit Lead
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Update the information for {lead.clientName}.
          </p>
        </div>

        <LeadForm
          initialValues={{
            clientName: lead.clientName,
            phone: lead.phone,
            eventType: lead.eventType,
            eventDate: lead.eventDate,
            budget: lead.budget,
            source: lead.source,
            assignedTo: lead.assignedTo,
            notes: lead.notes,
          }}
          onCancel={() => setEditing(false)}
          onSave={handleEdit}
          saveText="Save Changes"
        />

      </div>
    ) : (
      <LeadDetails
        lead={lead}
        onEdit={() => setEditing(true)}
        onDelete={handleDelete}
      />
    )}

  </div>

</DrawerContent>
    </Drawer>
  );
}
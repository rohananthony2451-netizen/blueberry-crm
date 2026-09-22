"use client";

import { useState } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

import type { Event } from "../types";
import type { EventFormValues } from "../validation";

import { EventDetails } from "./EventDetails";
import { EventForm } from "./EventForm";

interface EventDrawerProps {
  event: Event;
  children: React.ReactNode;

  onEdit?: (
    id: string,
    data: Partial<Event>
  ) => Promise<void>;

  onDelete?: (id: string) => void;

  onStatusChange?: (
    id: string,
    status: Event["status"]
  ) => Promise<void>;
}

export function EventDrawer({
  event,
  children,
  onEdit,
  onDelete,
  onStatusChange,
}: EventDrawerProps) {
  const [open, setOpen] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [
    statusUpdating,
    setStatusUpdating,
  ] = useState(false);

  async function handleEdit(
    data: EventFormValues
  ) {
    if (!onEdit) return;

    try {
      setSaving(true);

      await onEdit(event.id, {
        eventName:
          data.eventName,

        clientId:
          data.clientId,

        eventType:
          data.eventType,

        eventDate:
          data.eventDate,

        venue:
          data.venue,

        guestCount:
          Number(
            data.guestCount
          ),
      });

      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(
    status: Event["status"]
  ) {
    if (!onStatusChange) {
      return;
    }

    try {
      setStatusUpdating(true);

      await onStatusChange(
        event.id,
        status
      );
    } finally {
      setStatusUpdating(false);
    }
  }

  function handleDelete() {
    if (!onDelete) return;

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${event.eventName}"?`
      );

    if (!confirmed) return;

    onDelete(event.id);
    setOpen(false);
  }

  function handleDrawerChange(
    value: boolean
  ) {
    setOpen(value);

    if (!value) {
      setEditing(false);
      setStatusUpdating(false);
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={
        handleDrawerChange
      }
    >
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>

      <DrawerContent className="mx-auto max-h-[90vh] w-full max-w-xl overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto p-8">
          {editing ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">
                  Edit Event
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update the information for{" "}
                  {event.eventName}.
                </p>
              </div>

              <EventForm
                initialValues={{
                  eventName:
                    event.eventName,

                  clientId:
                    event.clientId ??
                    "",

                  eventType:
                    event.eventType,

                  eventDate:
                    event.eventDate,

                  venue:
                    event.venue,

                  guestCount:
                    event.guestCount.toString(),
                }}
                onCancel={() =>
                  setEditing(false)
                }
                onSave={
                  handleEdit
                }
                saveText={
                  saving
                    ? "Saving..."
                    : "Save Changes"
                }
              />
            </div>
          ) : (
            <EventDetails
              event={event}
              onEdit={() =>
                setEditing(true)
              }
              onDelete={
                handleDelete
              }
              onStatusChange={
                handleStatusChange
              }
              statusUpdating={
                statusUpdating
              }
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
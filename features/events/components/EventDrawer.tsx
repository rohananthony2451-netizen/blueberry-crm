"use client";

import { useState } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Event } from "../types";
import { EventDetails } from "./EventDetails";
import { EventForm } from "./EventForm";
import type { EventFormValues } from "../validation";

interface EventDrawerProps {
  event: Event;
  children: React.ReactNode;
  onEdit?: (
    id: string,
    data: Partial<Event>
  ) => void;
}

export function EventDrawer({
  event,
  children,
  onEdit,
}: EventDrawerProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  function handleEdit(data: EventFormValues) {
    if (!onEdit) return;

    onEdit(event.id, {
      eventName: data.eventName,
      clientName: data.clientName,
      eventType: data.eventType,
      eventDate: data.eventDate,
      venue: data.venue,
      guestCount: Number(data.guestCount),
    });

    setEditing(false);
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

      <DrawerContent className="mx-auto max-h-[90vh] w-full max-w-xl overflow-y-auto p-8">

        {editing ? (
          <div className="space-y-6">

            <div>
              <h2 className="text-2xl font-bold">
                Edit Event
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update the information for {event.eventName}.
              </p>
            </div>

            <EventForm
  initialValues={{
    eventName: event.eventName,
    clientName: event.clientName,
    eventType: event.eventType,
    eventDate: event.eventDate,
    venue: event.venue,
    guestCount: event.guestCount.toString(),
  }}
  onCancel={() => setEditing(false)}
  onSave={handleEdit}
  saveText="Save Changes"
/>

          </div>
        ) : (
          <EventDetails
            event={event}
            onEdit={() => setEditing(true)}
          />
        )}

      </DrawerContent>
    </Drawer>
  );
}
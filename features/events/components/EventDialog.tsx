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

import { Event, EventFormValues } from "../types";
import { EventForm } from "./EventForm";

interface EventDialogProps {
  onCreateEvent: (
    event: Event
  ) => void;
}

export function EventDialog({
  onCreateEvent,
}: EventDialogProps) {
  const [open, setOpen] = useState(false);

  function handleSave(
    data: EventFormValues
  ) {
    const newEvent: Event = {
      id: crypto.randomUUID(),
      eventName: data.eventName,
      clientName: data.clientName,
      eventType: data.eventType,
      eventDate: data.eventDate,
      venue: data.venue,
      guestCount: Number(data.guestCount),
      status: "Upcoming",
    };

    onCreateEvent(newEvent);
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>+ New Event</Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Create New Event
          </DialogTitle>
        </DialogHeader>

        <EventForm
          onCancel={() => setOpen(false)}
          onSave={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
}
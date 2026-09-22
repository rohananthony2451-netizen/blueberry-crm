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

import { EventForm } from "./EventForm";
import type { EventFormValues } from "../validation";

interface EventDialogProps {
  onCreateEvent: (
    data: EventFormValues
  ) => Promise<void>;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  initialValues?: Partial<EventFormValues>;

  showTrigger?: boolean;
}

export function EventDialog({
  onCreateEvent,
  open,
  onOpenChange,
  initialValues,
  showTrigger = true,
}: EventDialogProps) {
  const [internalOpen, setInternalOpen] =
    useState(false);

  const controlled =
    open !== undefined;

  const dialogOpen = controlled
    ? open
    : internalOpen;

  function handleOpenChange(
    value: boolean
  ) {
    if (!controlled) {
      setInternalOpen(value);
    }

    onOpenChange?.(value);
  }

  const initialFormValues =
    initialValues ?? {
      eventName: "",
      clientId: "",
      eventType: "",
      eventDate: "",
      venue: "",
      guestCount: "",
    };

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={handleOpenChange}
    >
      {showTrigger && (
        <DialogTrigger asChild>
          <Button>
            + New Event
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Create New Event
          </DialogTitle>
        </DialogHeader>

        <EventForm
          initialValues={initialFormValues}
          onCancel={() =>
            handleOpenChange(false)
          }
          onSave={onCreateEvent}
          saveText="Create Event"
        />
      </DialogContent>
    </Dialog>
  );
}
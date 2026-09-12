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
import { EventFormValues } from "../validation";

interface EventDialogProps {
  onCreateEvent: (
    data: EventFormValues
  ) => Promise<void>;
}

export function EventDialog({
  onCreateEvent,
}: EventDialogProps) {
  const [open, setOpen] = useState(false);

  const [saving, setSaving] =
    useState(false);

  async function handleSave(
    data: EventFormValues
  ) {
    try {
      setSaving(true);

      await onCreateEvent(data);

      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          + New Event
        </Button>
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
          saveText={
            saving
              ? "Creating..."
              : "Create Event"
          }
        />
      </DialogContent>
    </Dialog>
  );
}
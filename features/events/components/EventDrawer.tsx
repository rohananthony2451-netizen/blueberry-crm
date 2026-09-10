"use client";

import { useState } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Event } from "../types";
import { EventDetails } from "./EventDetails";

interface EventDrawerProps {
  event: Event;
  children: React.ReactNode;
}

export function EventDrawer({
  event,
  children,
}: EventDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>

      <DrawerContent className="mx-auto max-h-[90vh] w-full max-w-xl overflow-y-auto p-8">
        <EventDetails event={event} />
      </DrawerContent>
    </Drawer>
  );
}
"use client";

import { useState } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Lead } from "../types";
import { LeadDetails } from "./LeadDetails";

interface LeadDrawerProps {
  lead: Lead;
  children: React.ReactNode;
}

export function LeadDrawer({
  lead,
  children,
}: LeadDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>

      <DrawerContent className="mx-auto max-w-xl p-8">
        <LeadDetails lead={lead} />
      </DrawerContent>
    </Drawer>
  );
}
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
  onUpdateLead: (
    id: string,
    data: Partial<Lead>
  ) => Promise<Lead>;
}

export function LeadDrawer({
  lead,
  children,
  onUpdateLead,
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
        <LeadDetails
          lead={lead}
          onUpdateLead={onUpdateLead}
          onClose={() => setOpen(false)}
        />
      </DrawerContent>
    </Drawer>
  );
}
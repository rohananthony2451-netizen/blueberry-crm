"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { LeadDialog } from "./LeadDialog";

import type { Lead } from "../types";

interface LeadToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCreateLead: (
    lead: Omit<Lead, "id">
  ) => Promise<Lead>;
}

export function LeadToolbar({
  search,
  onSearchChange,
  onCreateLead,
}: LeadToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <Input
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            placeholder="Search leads..."
            className="pl-10"
          />
        </div>
      </div>

      <LeadDialog
        onCreateLead={onCreateLead}
      />
    </div>
  );
}
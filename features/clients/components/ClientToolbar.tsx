
"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ClientFormValues } from "../validation";
import { ClientDialog } from "./ClientDialog";

interface ClientToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCreateClient: (
    client: ClientFormValues
  ) => Promise<unknown>;
}

export function ClientToolbar({
  search,
  onSearchChange,
  onCreateClient,
}: ClientToolbarProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center">
        <div className="relative w-full max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />

          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search clients..."
            className="h-9 pl-9 text-sm"
          />
        </div>
      </div>

      <ClientDialog onCreateClient={onCreateClient} />
    </div>
  );
}

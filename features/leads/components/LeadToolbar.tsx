"use client";

import { Search, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LeadToolbar() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <Input
            placeholder="Search leads..."
            className="pl-10"
          />
        </div>
      </div>

      <Button>
        <Plus className="mr-2 h-4 w-4" />
        New Lead
      </Button>
    </div>
  );
}

"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface LeadToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function LeadToolbar({
  search,
  onSearchChange,
}: LeadToolbarProps) {
  return (
    <div className="relative min-w-0 flex-1">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={16}
        strokeWidth={2}
      />

      <Input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search leads..."
        className="h-11 w-full rounded-xl border-slate-200 bg-white pl-11 text-sm font-medium text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:border-slate-300 focus-visible:ring-1 focus-visible:ring-slate-200"
      />
    </div>
  );
}

"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/forms/FormSelect";

import {
  LEAD_STATUS,
  LEAD_SOURCES,
  LEAD_SORT_OPTIONS,
} from "../constants";

interface LeadFiltersProps {
  search: string;
  status: string;
  source: string;
  sortBy: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const CLEAR_VALUE = "__clear__";

export function LeadFilters({
  status,
  source,
  sortBy,
  onStatusChange,
  onSourceChange,
  onSortChange,
}: LeadFiltersProps) {
  const hasActiveFilters =
    status !== "" ||
    source !== "" ||
    sortBy !== "";

  function handleStatusChange(
    value: string
  ) {
    onStatusChange(
      value === CLEAR_VALUE ? "" : value
    );
  }

  function handleSourceChange(
    value: string
  ) {
    onSourceChange(
      value === CLEAR_VALUE ? "" : value
    );
  }

  function handleSortChange(
    value: string
  ) {
    onSortChange(
      value === CLEAR_VALUE ? "" : value
    );
  }

  function clearFilters() {
    onStatusChange("");
    onSourceChange("");
    onSortChange("");
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      <div className="w-[150px]">
        <FormSelect
          value={status}
          onValueChange={handleStatusChange}
          placeholder="All Status"
          options={[
            {
              label: "All Status",
              value: CLEAR_VALUE,
            },
            ...LEAD_STATUS,
          ]}
        />
      </div>

      <div className="w-[150px]">
        <FormSelect
          value={source}
          onValueChange={handleSourceChange}
          placeholder="All Sources"
          options={[
            {
              label: "All Sources",
              value: CLEAR_VALUE,
            },
            ...LEAD_SOURCES,
          ]}
        />
      </div>

      <div className="w-[135px]">
        <FormSelect
          value={sortBy}
          onValueChange={handleSortChange}
          placeholder="Sort by"
          options={[
            {
              label: "Default order",
              value: CLEAR_VALUE,
            },
            ...LEAD_SORT_OPTIONS,
          ]}
        />
      </div>

      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          onClick={clearFilters}
          className="h-10 shrink-0 px-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <RotateCcw
            className="mr-1.5 h-3.5 w-3.5"
            strokeWidth={2}
          />
          Reset
        </Button>
      )}
    </div>
  );
}
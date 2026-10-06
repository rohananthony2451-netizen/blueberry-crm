"use client";

import { Filter, X } from "lucide-react";

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

  function handleStatusChange(value: string) {
    onStatusChange(
      value === CLEAR_VALUE ? "" : value
    );
  }

  function handleSourceChange(value: string) {
    onSourceChange(
      value === CLEAR_VALUE ? "" : value
    );
  }

  function handleSortChange(value: string) {
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
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
            <Filter
              size={16}
              className="text-slate-600"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-900">
              Filters
            </p>

            <p className="text-xs text-slate-500">
              Refine your leads
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 sm:flex-row lg:justify-end">
          <div className="w-full sm:w-48">
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

          <div className="w-full sm:w-48">
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

          <div className="w-full sm:w-48">
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
              className="h-8 shrink-0 justify-center text-slate-500 hover:text-slate-900"
            >
              <X size={15} />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
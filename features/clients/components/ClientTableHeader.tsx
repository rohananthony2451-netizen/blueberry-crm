
"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export type ClientSortKey =
  | "name"
  | "venue"
  | "eventType"
  | "outstanding"
  | "nextEvent";

interface ClientTableHeaderProps {
  sortBy: ClientSortKey | null;
  sortDirection: "asc" | "desc";
  onSort: (key: ClientSortKey) => void;
}

const headers: {
  label: string;
  key: ClientSortKey;
  className: string;
}[] = [
  { label: "CLIENT", key: "name", className: "w-[31%]" },
  { label: "VENUE", key: "venue", className: "w-[23%]" },
  { label: "EVENT TYPE", key: "eventType", className: "w-[16%]" },
  { label: "OUTSTANDING", key: "outstanding", className: "w-[16%]" },
  { label: "NEXT EVENT", key: "nextEvent", className: "w-[14%]" },
];

export function ClientTableHeader({
  sortBy,
  sortDirection,
  onSort,
}: ClientTableHeaderProps) {
  return (
    <thead>
      <tr className="border-b bg-slate-50/70 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
        {headers.map((header) => {
          const active = sortBy === header.key;

          return (
            <th
              key={header.key}
              scope="col"
              aria-sort={
                active
                  ? sortDirection === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
              className={`${header.className} px-4 py-3`}
            >
              <button
                type="button"
                onClick={() => onSort(header.key)}
                className="group inline-flex items-center gap-1.5 rounded-sm text-left transition-colors hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                {header.label}
                {active ? (
                  sortDirection === "asc" ? (
                    <ArrowUp size={13} className="text-blue-600" />
                  ) : (
                    <ArrowDown size={13} className="text-blue-600" />
                  )
                ) : (
                  <ArrowUpDown
                    size={12}
                    className="text-slate-400 opacity-0 transition-opacity group-hover:opacity-100"
                  />
                )}
              </button>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

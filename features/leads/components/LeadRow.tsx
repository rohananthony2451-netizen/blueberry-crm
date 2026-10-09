import {
  CalendarDays,
  Mail,
  MoreHorizontal,
  Phone,
} from "lucide-react";

import { Lead } from "../types";
import { StatusBadge } from "./StatusBadge";
import { SourceBadge } from "./SourceBadge";
import { LeadDrawer } from "./LeadDrawer";

interface LeadRowProps {
  lead: Lead;
  onEdit?: (
    id: string,
    data: Partial<Lead>
  ) => Promise<void>;
  onDelete?: (
    id: string
  ) => Promise<void>;
}

function formatCurrency(value: string) {
  const amount = Number(
    value.replace(/[₹,\s]/g, "")
  );

  if (!Number.isFinite(amount)) {
    return value || "—";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value: string) {
  if (!value) return "No date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getInitials(name: string) {
  if (!name) return "?";

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}

export function LeadRow({
  lead,
  onEdit,
  onDelete,
}: LeadRowProps) {
  const assigneeName =
    lead.assignedToName?.trim() ||
    "Unassigned";

  return (
    <LeadDrawer
      lead={lead}
      onEdit={onEdit}
      onDelete={onDelete}
    >
      <tr className="group cursor-pointer border-b border-slate-100 bg-white transition-colors duration-150 hover:bg-slate-50">
        {/* Name */}
        <td className="px-5 py-4">
          <div className="min-w-0">
            <p className="truncate text-[14px] font-bold leading-tight text-slate-950">
              {lead.clientName}
            </p>

            <p className="mt-1 text-[12px] font-medium leading-tight text-slate-500">
              {lead.eventType || "Event"}
            </p>
          </div>
        </td>

        {/* Contact */}
        <td className="px-5 py-4">
          <div className="min-w-0 space-y-1.5">
            <div className="flex min-w-0 items-center gap-2">
              <Mail
                className="h-3.5 w-3.5 shrink-0 text-slate-400"
                strokeWidth={2}
              />

              <span className="truncate text-[13px] font-semibold leading-tight text-slate-800">
                {lead.email || "No email"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Phone
                className="h-3 w-3 shrink-0 text-slate-400"
                strokeWidth={2}
              />

              <span className="text-[12px] font-medium leading-tight text-slate-500">
                {lead.phone || "No phone"}
              </span>
            </div>
          </div>
        </td>

        {/* Source */}
        <td className="px-5 py-4">
          <SourceBadge source={lead.source} />
        </td>

        {/* Status */}
        <td className="px-5 py-4">
          <StatusBadge status={lead.status} />
        </td>

        {/* Estimated value */}
        <td className="px-5 py-4">
          <p className="whitespace-nowrap text-[14px] font-bold text-slate-950">
            {formatCurrency(lead.budget)}
          </p>
        </td>

        {/* Follow-up */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-2">
            <CalendarDays
              className="h-3.5 w-3.5 shrink-0 text-slate-400"
              strokeWidth={2}
            />

            <span className="whitespace-nowrap text-[13px] font-semibold text-slate-700">
              {formatDate(
                lead.followUpDate
              )}
            </span>
          </div>
        </td>

        {/* Assignee */}
        <td className="px-5 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-[29px] w-[29px] shrink-0 items-center justify-center rounded-full bg-sky-100 text-[9px] font-bold text-sky-700 ring-1 ring-inset ring-sky-200">
              {getInitials(
                assigneeName
              )}
            </div>

            <span className="truncate text-[13px] font-semibold text-slate-800">
              {assigneeName}
            </span>
          </div>
        </td>

        {/* Actions */}
        <td className="px-3 py-4">
          <div className="flex justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors group-hover:bg-slate-100 group-hover:text-slate-700">
              <MoreHorizontal
                className="h-[18px] w-[18px] "
                strokeWidth={2}
              />
            </div>
          </div>
        </td>
      </tr>
    </LeadDrawer>
  );
}
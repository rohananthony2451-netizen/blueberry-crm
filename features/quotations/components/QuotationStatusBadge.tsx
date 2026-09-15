import { QuotationStatus } from "../types";

interface QuotationStatusBadgeProps {
  status: QuotationStatus;
}

const statusStyles: Record<
  QuotationStatus,
  string
> = {
  Draft:
    "bg-slate-100 text-slate-700 border-slate-200",

  Sent:
    "bg-blue-50 text-blue-700 border-blue-200",

  Accepted:
    "bg-emerald-50 text-emerald-700 border-emerald-200",

  Rejected:
    "bg-red-50 text-red-700 border-red-200",
};

export function QuotationStatusBadge({
  status,
}: QuotationStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
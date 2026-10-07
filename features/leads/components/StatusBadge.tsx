import { cn } from "@/lib/utils";

const colors = {
  New: {
    wrapper: "bg-blue-50 text-blue-700 ring-blue-200",
    dot: "bg-blue-500",
  },
  Contacted: {
    wrapper: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
  },
  "Meeting Scheduled": {
    wrapper: "bg-violet-50 text-violet-700 ring-violet-200",
    dot: "bg-violet-500",
  },
  "Quotation Sent": {
    wrapper: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    dot: "bg-indigo-500",
  },
  Won: {
    wrapper: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  Lost: {
    wrapper: "bg-red-50 text-red-700 ring-red-200",
    dot: "bg-red-500",
  },
  Converted: {
    wrapper: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
};

type Status = keyof typeof colors;

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({
  status,
}: StatusBadgeProps) {
  const style = colors[status] ?? colors.New;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
        "text-xs font-bold leading-none ring-1 ring-inset",
        style.wrapper
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          style.dot
        )}
      />

      {status}
    </span>
  );
}
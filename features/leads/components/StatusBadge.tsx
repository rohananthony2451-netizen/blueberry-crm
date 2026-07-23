import { cn } from "@/lib/utils";

const colors = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  "Meeting Scheduled": "bg-purple-100 text-purple-700",
  "Quotation Sent": "bg-indigo-100 text-indigo-700",
  Won: "bg-green-100 text-green-700",
  Lost: "bg-red-100 text-red-700",
};

type Status = keyof typeof colors;

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium",
        colors[status]
      )}
    >
      {status}
    </span>
  );
}
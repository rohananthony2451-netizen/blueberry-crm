import { EventStatus } from "../types";

interface EventStatusBadgeProps {
  status: EventStatus;
}

export function EventStatusBadge({
  status,
}: EventStatusBadgeProps) {
  const styles: Record<EventStatus, string> = {
    Upcoming:
      "bg-blue-100 text-blue-700",
    "In Progress":
      "bg-amber-100 text-amber-700",
    Completed:
      "bg-green-100 text-green-700",
    Cancelled:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
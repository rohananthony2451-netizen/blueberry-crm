interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors: Record<string, string> = {
    New: "bg-blue-100 text-blue-700",
    "Follow Up": "bg-yellow-100 text-yellow-700",
    Quoted: "bg-purple-100 text-purple-700",
    Booked: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        colors[status] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}
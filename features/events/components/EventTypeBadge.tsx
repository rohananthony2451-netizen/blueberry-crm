interface EventTypeBadgeProps {
  type: string;
}

export function EventTypeBadge({
  type,
}: EventTypeBadgeProps) {
  return (
    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
      {type}
    </span>
  );
}
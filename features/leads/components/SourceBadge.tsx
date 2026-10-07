interface SourceBadgeProps {
  source: string;
}

export function SourceBadge({
  source,
}: SourceBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold leading-none text-slate-700 ring-1 ring-inset ring-slate-200">
      {source || "Unknown"}
    </span>
  );
}
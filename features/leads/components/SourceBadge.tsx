interface SourceBadgeProps {
  source: string;
}

export function SourceBadge({ source }: SourceBadgeProps) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
      {source}
    </span>
  );
}
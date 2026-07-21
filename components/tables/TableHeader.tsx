interface TableHeaderProps {
  headers: string[];
}

export function TableHeader({
  headers,
}: TableHeaderProps) {
  return (
    <thead className="bg-slate-50">
      <tr>
        {headers.map(header => (
          <th
            key={header}
            className="px-4 py-3 text-left text-sm font-semibold text-slate-600"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}
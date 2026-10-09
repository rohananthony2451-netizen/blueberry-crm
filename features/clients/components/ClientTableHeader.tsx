
export function ClientTableHeader() {
  const headers = [
    { label: "CLIENT", className: "w-[31%]" },
    { label: "VENUE", className: "w-[23%]" },
    { label: "EVENT TYPE", className: "w-[16%]" },
    { label: "OUTSTANDING", className: "w-[16%]" },
    { label: "NEXT EVENT", className: "w-[14%]" },
  ];

  return (
    <thead className="bg-slate-50">
      <tr>
        {headers.map((header) => (
          <th
            key={header.label}
            className={`${header.className} border-b border-slate-200 px-4 py-2 text-left text-[10px] font-semibold tracking-wide text-slate-500`}
          >
            {header.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}

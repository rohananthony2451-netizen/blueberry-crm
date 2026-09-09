export function ClientTableHeader() {
  return (
    <thead className="bg-slate-50">
      <tr>
        <th className="px-4 py-3 text-left text-sm font-semibold">
          Name
        </th>

        <th className="px-4 py-3 text-left text-sm font-semibold">
          Phone
        </th>

        <th className="px-4 py-3 text-left text-sm font-semibold">
          Email
        </th>

        <th className="px-4 py-3 text-left text-sm font-semibold">
          Address
        </th>
      </tr>
    </thead>
  );
}
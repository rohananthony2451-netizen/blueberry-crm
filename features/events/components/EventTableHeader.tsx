export function EventTableHeader() {
  return (
    <thead>
      <tr className="border-b bg-slate-50 text-left text-sm text-slate-500">
        <th className="px-4 py-3 font-medium">
          Event
        </th>

        <th className="px-4 py-3 font-medium">
          Client
        </th>

        <th className="px-4 py-3 font-medium">
          Type
        </th>

        <th className="px-4 py-3 font-medium">
          Date
        </th>

        <th className="px-4 py-3 font-medium">
          Venue
        </th>

        <th className="px-4 py-3 font-medium">
          Guests
        </th>

        <th className="px-4 py-3 font-medium">
          Status
        </th>
      </tr>
    </thead>
  );
}
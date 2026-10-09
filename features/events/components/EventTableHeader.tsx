export function EventTableHeader() {
  return (
    <thead>
      <tr className="border-b bg-slate-50/80 text-left text-[11px] font-medium uppercase tracking-wide text-slate-500">
        <th className="w-[22%] px-4 py-3">Event</th>
        <th className="w-[16%] px-4 py-3">Client</th>
        <th className="w-[16%] px-4 py-3">Venue</th>
        <th className="w-[11%] px-4 py-3">Date</th>
        <th className="w-[11%] px-4 py-3">Type</th>
        <th className="w-[12%] px-4 py-3">Status</th>
        <th className="w-[12%] px-4 py-3">Amount</th>
      </tr>
    </thead>
  );
}

export function LeadTableHeader() {
  return (
    <thead className="bg-slate-50/70">
      <tr className="border-b border-slate-200">
        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.05em] text-slate-600">
          Name
        </th>
        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.05em] text-slate-600">
          Contact
        </th>
        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.05em] text-slate-600">
          Source
        </th>
        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.05em] text-slate-600">
          Status
        </th>
        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.05em] text-slate-600">
          Estimated Value
        </th>
        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.05em] text-slate-600">
          Follow-up
        </th>
        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.05em] text-slate-600">
          Assignee
        </th>
        <th className="px-3 py-4 text-center text-[11px] font-bold uppercase tracking-[0.05em] text-slate-600">
          Actions
        </th>
      </tr>
    </thead>
  );
}

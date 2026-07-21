export function TableFooter() {
  return (
    <div className="flex items-center justify-between border-t px-6 py-4">
      <p className="text-sm text-slate-500">
        Showing 1–5 of 24 Leads
      </p>

      <div className="flex gap-2">
        <button className="rounded border px-3 py-1">
          Previous
        </button>

        <button className="rounded border px-3 py-1">
          Next
        </button>
      </div>
    </div>
  );
}
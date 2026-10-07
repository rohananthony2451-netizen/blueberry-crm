interface TableEmptyProps {
  message: string;
}

export function TableEmpty({
  message,
}: TableEmptyProps) {
  return (
    <tr>
      <td
        colSpan={20}
        className="px-6 py-16 text-center"
      >
        <div className="mx-auto max-w-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <div className="h-2.5 w-2.5 rounded-full bg-slate-400" />
          </div>

          <p className="mt-4 text-sm font-bold text-slate-900">
            {message}
          </p>

          <p className="mt-1 text-sm font-medium text-slate-500">
            Try adjusting your filters or add a new lead.
          </p>
        </div>
      </td>
    </tr>
  );
}
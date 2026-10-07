import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface TableFooterProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function TableFooter({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: TableFooterProps) {
  if (totalItems === 0) {
    return null;
  }

  const start =
    (currentPage - 1) * pageSize + 1;

  const end = Math.min(
    currentPage * pageSize,
    totalItems
  );

  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3.5">
      <p className="text-sm font-medium text-slate-500">
        Showing{" "}
        <span className="font-semibold text-slate-700">
          {start}–{end}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-700">
          {totalItems}
        </span>{" "}
        Leads
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() =>
            onPageChange(currentPage - 1)
          }
          disabled={currentPage === 1}
          className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft
            className="h-3.5 w-3.5"
            strokeWidth={2}
          />
          Previous
        </button>

        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() =>
              onPageChange(page)
            }
            className={
              page === currentPage
                ? "h-8 min-w-8 rounded-lg bg-blue-600 px-2.5 text-xs font-bold text-white shadow-sm"
                : "h-8 min-w-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            }
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() =>
            onPageChange(currentPage + 1)
          }
          disabled={
            currentPage === totalPages
          }
          className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight
            className="h-3.5 w-3.5"
            strokeWidth={2}
          />
        </button>
      </div>
    </div>
  );
}
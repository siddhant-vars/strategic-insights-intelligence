import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Insight } from "@/types/insight";
import { cn, INTENSITY_LEVEL_STYLES } from "@/lib/utils";
import { RowSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

const COLUMNS: Column[] = [
  { key: "title", label: "Title", sortable: true },
  { key: "sector", label: "Sector", sortable: true },
  { key: "topic", label: "Topic", sortable: true },
  { key: "region", label: "Region", sortable: true },
  { key: "country", label: "Country", sortable: true },
  { key: "city", label: "City" },
  { key: "intensity", label: "Intensity", sortable: true },
  { key: "likelihood", label: "Likelihood", sortable: true },
  { key: "relevance", label: "Relevance", sortable: true },
  { key: "endYear", label: "End Year", sortable: true },
  { key: "pestle", label: "PESTLE", sortable: true },
  { key: "source", label: "Source" },
];

interface DataTableProps {
  rows: Insight[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  total: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (key: string) => void;
  onPageChange: (page: number) => void;
  onRowClick: (insight: Insight) => void;
}

export function DataTable({ rows, isLoading, page, totalPages, total, sortBy, sortOrder, onSort, onPageChange, onRowClick }: DataTableProps) {
  return (
    <div className="rounded-xl2 border border-slate-200/70 bg-surface shadow-card dark:border-slate-800 dark:bg-surface-dark">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key} className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {col.sortable ? (
                    <button
                      onClick={() => onSort(col.key)}
                      className="focus-ring flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      {col.label}
                      {sortBy === col.key ? (
                        sortOrder === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                      ) : (
                        <ArrowUpDown size={12} className="opacity-30" />
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading &&
              [...Array(8)].map((_, i) => (
                <tr key={i}>
                  <td colSpan={COLUMNS.length}>
                    <RowSkeleton />
                  </td>
                </tr>
              ))}

            {!isLoading &&
              rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick(row)}
                  className="cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="max-w-[260px] truncate px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{row.title}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.sector ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.topic ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.region ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.country ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-400 dark:text-slate-500">{row.city ?? "—"}</td>
                  <td className="px-4 py-3">
                    {row.intensity !== null ? (
                      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", row.intensityLevel && INTENSITY_LEVEL_STYLES[row.intensityLevel])}>
                        {row.intensity} · {row.intensityLevel}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.likelihood ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.relevance ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.endYear ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.pestle ?? "—"}</td>
                  <td className="px-4 py-3">
                    {row.url ? (
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="focus-ring inline-flex items-center gap-1 text-brand-600 hover:underline dark:text-brand-400"
                      >
                        {row.source ?? "Source"} <ExternalLink size={11} />
                      </a>
                    ) : (
                      row.source ?? "—"
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!isLoading && rows.length === 0 && <EmptyState message="No insights match the current filters and search." />}

      <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 dark:border-slate-800 sm:flex-row">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Page {page} of {totalPages} · {total} total insights
        </span>
        <div className="flex items-center gap-1.5">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="focus-ring flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="focus-ring flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

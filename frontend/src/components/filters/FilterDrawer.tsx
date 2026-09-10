import { X, RotateCcw } from "lucide-react";
import { FilterBar } from "./FilterBar";
import { useFilters } from "@/hooks/useFilters";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function FilterDrawer({ open, onClose }: FilterDrawerProps) {
  const { activeFilterCount, resetFilters } = useFilters();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-sm animate-slide-in flex-col bg-surface shadow-2xl dark:bg-surface-dark">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</h2>
          <button onClick={onClose} className="focus-ring rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" aria-label="Close filters">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <FilterBar layout="stack" />
        </div>
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <button
            onClick={resetFilters}
            className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RotateCcw size={14} /> Reset all filters
          </button>
        </div>
      </div>
    </div>
  );
}

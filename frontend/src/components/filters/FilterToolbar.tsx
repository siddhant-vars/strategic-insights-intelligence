import { FilterBar, ActiveFilterChips } from "./FilterBar";
import { useFilters } from "@/hooks/useFilters";

export function FilterToolbar() {
  const { activeFilterCount } = useFilters();

  return (
    <div className="mb-6 hidden rounded-xl2 border border-slate-200/70 bg-surface p-3.5 shadow-card dark:border-slate-800 dark:bg-surface-dark lg:block">
      <FilterBar layout="row" />
      {activeFilterCount > 0 && (
        <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800">
          <ActiveFilterChips />
        </div>
      )}
    </div>
  );
}

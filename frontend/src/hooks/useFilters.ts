import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ActiveFilters, FILTER_KEYS, FilterKey } from "@/types/insight";

/**
 * All dashboard filters live in the URL query string. This gives us
 * shareable/bookmarkable filtered views for free and means every page reads
 * from a single source of truth instead of duplicated component state.
 * Multi-select values are stored as comma-separated strings within a single
 * query param (e.g. ?sector=Energy,Retail).
 */
export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ActiveFilters = useMemo(() => {
    const result: ActiveFilters = {};
    FILTER_KEYS.forEach((key) => {
      const value = searchParams.get(key);
      if (value) result[key] = value;
    });
    return result;
  }, [searchParams]);

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter((v) => v && v.length > 0).length,
    [filters]
  );

  const setFilter = useCallback(
    (key: FilterKey, value: string | string[] | null) => {
      const next = new URLSearchParams(searchParams);
      if (!value || (Array.isArray(value) && value.length === 0)) {
        next.delete(key);
      } else {
        next.set(key, Array.isArray(value) ? value.join(",") : value);
      }
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const toggleMultiValue = useCallback(
    (key: FilterKey, value: string) => {
      const current = filters[key] ? filters[key]!.split(",") : [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      setFilter(key, next);
    },
    [filters, setFilter]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const toQueryParams = useCallback(
    (extra?: Record<string, string>) => {
      const params = new URLSearchParams();
      FILTER_KEYS.forEach((key) => {
        if (filters[key]) params.set(key, filters[key]!);
      });
      if (extra) {
        Object.entries(extra).forEach(([k, v]) => params.set(k, v));
      }
      return params;
    },
    [filters]
  );

  return { filters, activeFilterCount, setFilter, toggleMultiValue, resetFilters, toQueryParams };
}

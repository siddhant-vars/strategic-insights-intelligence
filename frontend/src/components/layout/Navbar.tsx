import { useLocation } from "react-router-dom";
import { Menu, PanelLeftClose, PanelLeftOpen, Search, Sun, Moon, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useFilters } from "@/hooks/useFilters";
import { useDebouncedValue } from "@/hooks/useDebounce";
import { useEffect } from "react";

const BREADCRUMB_LABELS: Record<string, string> = {
  "/": "Overview",
  "/sectors": "Sector Intelligence",
  "/geography": "Geographic Intelligence",
  "/risk-matrix": "Risk Matrix",
  "/explorer": "Data Explorer",
  "/about": "About Dataset",
};

interface NavbarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onOpenMobileSidebar: () => void;
  onOpenMobileFilters: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function Navbar({ collapsed, onToggleCollapsed, onOpenMobileSidebar, onOpenMobileFilters, theme, onToggleTheme }: NavbarProps) {
  const location = useLocation();
  const { filters, activeFilterCount, setFilter, resetFilters } = useFilters();
  const [searchInput, setSearchInput] = useState(filters.q ?? "");
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  useEffect(() => {
    setFilter("q", debouncedSearch || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const breadcrumb = BREADCRUMB_LABELS[location.pathname] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200/70 bg-surface/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-surface-dark/80 sm:px-6">
      <button
        onClick={onOpenMobileSidebar}
        className="focus-ring rounded-md p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <button
        onClick={onToggleCollapsed}
        className="focus-ring hidden rounded-md p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:block"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
      </button>

      <div className="hidden text-sm text-slate-500 dark:text-slate-400 md:block">
        <span className="text-slate-400 dark:text-slate-500">Dashboard</span>
        <span className="mx-1.5">/</span>
        <span className="font-medium text-slate-700 dark:text-slate-200">{breadcrumb}</span>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="relative hidden sm:block">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search insights, topics, sources…"
            className="focus-ring w-56 rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 lg:w-72"
          />
        </div>

        <button
          onClick={onOpenMobileFilters}
          className="focus-ring relative rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open filters"
        >
          <SlidersHorizontal size={18} />
          {activeFilterCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="focus-ring hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:flex"
          >
            <RotateCcw size={14} />
            Reset ({activeFilterCount})
          </button>
        )}

        <button
          onClick={onToggleTheme}
          className="focus-ring rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}

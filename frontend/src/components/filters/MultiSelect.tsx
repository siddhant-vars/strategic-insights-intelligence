import { useMemo, useRef, useState, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
  disabledReason?: string;
}

export function MultiSelect({ label, options, selected, onChange, disabled, disabledReason }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const filtered = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(query.toLowerCase())),
    [options, query]
  );

  function toggle(value: string) {
    if (selected.includes(value)) onChange(selected.filter((v) => v !== value));
    else onChange([...selected, value]);
  }

  const buttonLabel =
    selected.length === 0 ? label : selected.length === 1 ? selected[0] : `${label} (${selected.length})`;

  if (disabled) {
    return (
      <div className="group relative">
        <button
          disabled
          title={disabledReason}
          className="flex w-full cursor-not-allowed items-center justify-between gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-600"
        >
          <span className="truncate">{label}</span>
          <ChevronDown size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "focus-ring flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
          selected.length > 0
            ? "border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        )}
      >
        <span className="truncate">{buttonLabel}</span>
        <ChevronDown size={14} className={cn("shrink-0 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-40 mt-1.5 w-64 animate-fade-in rounded-lg border border-slate-200 bg-white shadow-card-hover dark:border-slate-700 dark:bg-slate-900">
          <div className="relative border-b border-slate-100 p-2 dark:border-slate-800">
            <Search size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}…`}
              className="w-full rounded-md border-0 bg-slate-50 py-1.5 pl-7 pr-2 text-sm text-slate-700 focus:outline-none dark:bg-slate-800 dark:text-slate-200"
            />
          </div>
          <div className="max-h-56 overflow-y-auto p-1">
            {filtered.length === 0 && <div className="px-3 py-4 text-center text-xs text-slate-400">No matches</div>}
            {filtered.map((opt) => (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className="focus-ring flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                    selected.includes(opt)
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-slate-300 dark:border-slate-600"
                  )}
                >
                  {selected.includes(opt) && <Check size={11} strokeWidth={3} />}
                </span>
                <span className="truncate">{opt}</span>
              </button>
            ))}
          </div>
          {selected.length > 0 && (
            <div className="border-t border-slate-100 p-2 dark:border-slate-800">
              <button
                onClick={() => onChange([])}
                className="focus-ring w-full rounded-md px-2 py-1 text-center text-xs font-medium text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

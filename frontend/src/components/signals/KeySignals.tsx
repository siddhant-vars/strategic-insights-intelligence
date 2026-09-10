import { Sparkles } from "lucide-react";

interface KeySignalsProps {
  signals: string[];
  isLoading?: boolean;
}

export function KeySignals({ signals, isLoading }: KeySignalsProps) {
  return (
    <div className="rounded-xl2 border border-brand-100 bg-gradient-to-br from-brand-50/60 via-white to-white p-5 shadow-card dark:border-brand-900/40 dark:from-brand-950/20 dark:via-surface-dark dark:to-surface-dark">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Sparkles size={14} />
        </div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Key Signals</h3>
        <span className="text-xs text-slate-400 dark:text-slate-500">Deterministically derived from the current selection</span>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-3.5 w-full animate-pulse rounded bg-slate-200/70 dark:bg-slate-800" />
          ))}
        </div>
      ) : (
        <ul className="space-y-2.5">
          {signals.map((s, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-slate-700 dark:text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

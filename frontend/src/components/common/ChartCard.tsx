import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./EmptyState";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  minHeight?: number;
}

export function ChartCard({
  title,
  subtitle,
  isLoading,
  isEmpty,
  emptyMessage = "No data available for the current filters.",
  actions,
  children,
  className,
  minHeight = 320,
}: ChartCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl2 border border-slate-200/70 bg-surface p-5 shadow-card transition-shadow hover:shadow-card-hover dark:border-slate-800 dark:bg-surface-dark",
        "animate-fade-in",
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      <div style={{ minHeight }}>
        {isLoading ? (
          <LoadingSkeleton height={minHeight} />
        ) : isEmpty ? (
          <EmptyState message={emptyMessage} />
        ) : (
          children
        )}
      </div>
    </div>
  );
}

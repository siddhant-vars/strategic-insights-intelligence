interface LoadingSkeletonProps {
  height?: number;
  className?: string;
}

export function LoadingSkeleton({ height = 200 }: LoadingSkeletonProps) {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-2" style={{ minHeight: height }}>
      <div className="h-full w-full animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" />
    </div>
  );
}

export function KpiSkeleton() {
  return (
    <div className="rounded-xl2 border border-slate-200/70 bg-surface p-5 shadow-card dark:border-slate-800 dark:bg-surface-dark">
      <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-3 h-8 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-3 h-3 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-3 flex-1 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      ))}
    </div>
  );
}

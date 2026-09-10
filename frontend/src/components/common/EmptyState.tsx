import { Inbox, AlertTriangle, WifiOff } from "lucide-react";

interface EmptyStateProps {
  message?: string;
  icon?: "empty" | "error" | "offline";
  action?: React.ReactNode;
}

const ICONS = {
  empty: Inbox,
  error: AlertTriangle,
  offline: WifiOff,
};

export function EmptyState({ message = "No data available.", icon = "empty", action }: EmptyStateProps) {
  const Icon = ICONS[icon];
  return (
    <div className="flex h-full min-h-[180px] flex-col items-center justify-center gap-2 text-center">
      <Icon className="mb-1 h-8 w-8 text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
      <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">{message}</p>
      {action}
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "Something went wrong while loading data.", onRetry }: ErrorStateProps) {
  return (
    <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3 rounded-xl2 border border-rose-200 bg-rose-50/50 p-6 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
      <AlertTriangle className="h-8 w-8 text-rose-400" strokeWidth={1.5} />
      <p className="max-w-sm text-sm text-rose-700 dark:text-rose-300">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="focus-ring rounded-lg bg-rose-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-rose-700"
        >
          Retry
        </button>
      )}
    </div>
  );
}

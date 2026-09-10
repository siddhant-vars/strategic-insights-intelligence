import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  context: string;
  accent?: "brand" | "emerald" | "amber" | "sky";
}

const ACCENTS: Record<string, string> = {
  brand: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  sky: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
};

export function KpiCard({ icon: Icon, label, value, context, accent = "brand" }: KpiCardProps) {
  return (
    <div className="group rounded-xl2 border border-slate-200/70 bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover dark:border-slate-800 dark:bg-surface-dark animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg transition-transform group-hover:scale-105", ACCENTS[accent])}>
          <Icon className="h-4.5 w-4.5" size={18} strokeWidth={2} />
        </div>
      </div>
      <div className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</div>
      <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{context}</div>
    </div>
  );
}

import { clsx, ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const INTENSITY_LEVEL_STYLES: Record<string, string> = {
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30",
  Medium: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/30",
  High: "bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/30",
  Critical: "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/30",
};

export const PESTLE_COLORS: Record<string, string> = {
  Political: "#6366f1",
  Economic: "#0ea5e9",
  Social: "#10b981",
  Technological: "#f59e0b",
  Legal: "#ef4444",
  Environmental: "#22c55e",
  Industries: "#8b5cf6",
  Healthcare: "#ec4899",
  Lifestyles: "#14b8a6",
  Organization: "#64748b",
};

export function pestleColor(pestle: string | null | undefined): string {
  if (!pestle) return "#94a3b8";
  return PESTLE_COLORS[pestle] ?? "#94a3b8";
}

export function formatDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

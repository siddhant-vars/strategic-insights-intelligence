import { X, ExternalLink } from "lucide-react";
import { useInsightDetail } from "@/api/queries";
import { cn, INTENSITY_LEVEL_STYLES, formatDate } from "@/lib/utils";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";

interface InsightDrawerProps {
  insightId: string | null;
  onClose: () => void;
}

function ScoreBar({ label, value, max }: { label: string; value: number | null; max: number }) {
  const pct = value !== null ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-500 dark:text-slate-400">{label}</span>
        <span className="font-semibold text-slate-700 dark:text-slate-200">{value ?? "—"}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</div>
      <div className="mt-0.5 text-sm text-slate-700 dark:text-slate-200">{value ?? "—"}</div>
    </div>
  );
}

export function InsightDrawer({ insightId, onClose }: InsightDrawerProps) {
  const { data: insight, isLoading } = useInsightDetail(insightId);

  if (!insightId) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-lg animate-slide-in flex-col overflow-hidden bg-surface shadow-2xl dark:bg-surface-dark">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Insight Details</h2>
          <button onClick={onClose} className="focus-ring rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {isLoading || !insight ? (
            <LoadingSkeleton height={400} />
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold leading-snug text-slate-900 dark:text-white">{insight.title}</h3>
                {insight.intensityLevel && (
                  <span className={cn("mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", INTENSITY_LEVEL_STYLES[insight.intensityLevel])}>
                    {insight.intensityLevel} intensity
                  </span>
                )}
              </div>

              {insight.insightText && (
                <p className="rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
                  {insight.insightText}
                </p>
              )}

              <div className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <ScoreBar label="Intensity" value={insight.intensity} max={96} />
                <ScoreBar label="Likelihood" value={insight.likelihood} max={4} />
                <ScoreBar label="Relevance" value={insight.relevance} max={7} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Sector" value={insight.sector} />
                <Field label="Topic" value={insight.topic} />
                <Field label="Country" value={insight.country} />
                <Field label="Region" value={insight.region} />
                <Field label="City" value={insight.city} />
                <Field label="PESTLE" value={insight.pestle} />
                <Field label="Source" value={insight.source} />
                <Field label="Impact" value={insight.impact} />
                <Field label="Start Year" value={insight.startYear} />
                <Field label="End Year" value={insight.endYear} />
                <Field label="Published" value={formatDate(insight.published)} />
                <Field label="Added" value={formatDate(insight.added)} />
              </div>

              {insight.url && (
                <a
                  href={insight.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
                >
                  View original source <ExternalLink size={14} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

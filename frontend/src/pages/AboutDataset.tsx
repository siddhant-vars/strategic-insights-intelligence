import { useAnalytics } from "@/api/queries";
import { PageHeader } from "@/components/common/MetricBadge";
import { AlertCircle, CheckCircle2 } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl2 border border-slate-200/70 bg-surface p-5 shadow-card dark:border-slate-800 dark:bg-surface-dark">
      <h3 className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      <div className="space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{children}</div>
    </div>
  );
}

export default function AboutDataset() {
  const { data } = useAnalytics(new URLSearchParams());

  return (
    <div>
      <PageHeader title="About This Dataset" description="How the source data was inspected, normalized, and where it has real gaps." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Section title="Dataset Snapshot">
          <p>1000 records were supplied in <code>jsondata.json</code>, imported as-is with no rows removed except those missing a required title (0 in this dataset).</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Intensity: numeric, observed range 1–96 (not a 0–10 scale)</li>
            <li>Likelihood: numeric, observed range 1–4</li>
            <li>Relevance: numeric, observed range 1–7</li>
            <li>Impact: only present on 34 of 1000 records</li>
            <li>End Year present on {1000 - (data?.meta.missingEndYearCount ?? 742)} of 1000 records</li>
            <li>Country present on {1000 - (data?.meta.missingCountryCount ?? 650)} of 1000 records</li>
          </ul>
        </Section>

        <Section title="Normalization Rules Applied">
          <ul className="ml-4 list-disc space-y-1">
            <li>Empty strings ("") were converted to <code>null</code> for every field — never treated as a real category or coerced to zero.</li>
            <li>Numeric fields were safely parsed; unparseable values became <code>null</code>.</li>
            <li>Categorical strings were trimmed.</li>
            <li>A single casing inconsistency was merged: region values "world" and "World" were unified to "World" — no new category was invented.</li>
            <li><code>added</code> / <code>published</code> timestamps were parsed into real dates; unparseable values became <code>null</code>.</li>
          </ul>
        </Section>

        <Section title="Intensity Level Thresholds">
          <p>Because raw intensity spans 1–96 with a heavy right skew (median 8), Low/Medium/High/Critical bands used throughout the app are derived directly from this dataset's actual quartiles, not an arbitrary guess:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Low: intensity ≤ 4 (bottom quartile)</li>
            <li>Medium: intensity 5–8 (25th–50th percentile)</li>
            <li>High: intensity 9–12 (50th–75th percentile)</li>
            <li>Critical: intensity &gt; 12 (top quartile)</li>
          </ul>
        </Section>

        <Section title="City Filter">
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-500/10">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-amber-800 dark:text-amber-300">
              The source dataset contains <strong>no city field whatsoever</strong> — this was verified by inspecting all 1000
              records directly. The City filter is implemented and wired end-to-end, but will always show "not
              available in source data" rather than a fabricated list of cities.
            </p>
          </div>
        </Section>

        <Section title="SWOT Handling Decision">
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-500/10">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-amber-800 dark:text-amber-300">
              The source dataset contains <strong>no swot field whatsoever</strong>. No other field in the data (sector,
              topic, pestle, intensity, etc.) provides a legitimate, deterministic basis for classifying a record as
              a Strength, Weakness, Opportunity, or Threat without inventing a subjective rule the data doesn't
              support. Rather than fabricate SWOT labels, the SWOT filter is implemented and will always report "no
              SWOT data available" for this dataset.
            </p>
          </div>
        </Section>

        <Section title="Key Signals Methodology">
          <div className="flex items-start gap-2 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-500/10">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p className="text-emerald-800 dark:text-emerald-300">
              Every statement in the "Key Signals" panel is generated by deterministic MongoDB aggregation
              (top sector/region/PESTLE by count, the single highest-intensity record) against whatever filters are
              currently active — never by an LLM and never hardcoded.
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
}

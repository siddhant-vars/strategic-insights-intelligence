import { useState } from "react";
import { Gauge, TrendingUp, Target, Database } from "lucide-react";
import { useAnalytics } from "@/api/queries";
import { useFilters } from "@/hooks/useFilters";
import { FilterToolbar } from "@/components/filters/FilterToolbar";
import { KpiCard } from "@/components/kpi/KpiCard";
import { KpiSkeleton } from "@/components/common/LoadingSkeleton";
import { KeySignals } from "@/components/signals/KeySignals";
import { ChartCard } from "@/components/common/ChartCard";
import { TimeChart } from "@/components/charts/TimeChart";
import { PestleChart } from "@/components/charts/PestleChart";
import { SectorChart } from "@/components/charts/SectorChart";
import { ErrorState } from "@/components/common/EmptyState";
import { InsightDrawer } from "@/components/drawer/InsightDrawer";

export default function Overview() {
  const { toQueryParams, setFilter } = useFilters();
  const { data, isLoading, isError, refetch } = useAnalytics(toQueryParams());
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

  const total = data?.summary.total ?? 0;
  const sectors = data?.summary.sectorCount ?? 0;
  const regions = data?.summary.regionCount ?? 0;
  const countries = data?.summary.countryCount ?? 0;

  return (
    <div>
      <div className="mb-6 animate-fade-in rounded-xl2 border border-slate-200/70 bg-gradient-to-br from-white via-white to-brand-50/40 p-6 shadow-card dark:border-slate-800 dark:from-surface-dark dark:via-surface-dark dark:to-brand-950/20 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Global signals, risks &amp; emerging trends
        </p>
        <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Strategic Intelligence Overview
        </h1>
        {!isLoading && data && (
          <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:text-[15px]">
            Explore {total.toLocaleString()} strategic insights across {sectors} sectors, {regions} regions and {countries}{" "}
            countries with recorded data.
          </p>
        )}
      </div>

      <FilterToolbar />

      {isError ? (
        <ErrorState message="Could not load dashboard analytics. Check that the API server is running." onRetry={() => refetch()} />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading || !data ? (
              [...Array(4)].map((_, i) => <KpiSkeleton key={i} />)
            ) : (
              <>
                <KpiCard
                  icon={Gauge}
                  label="Avg Intensity"
                  value={data.summary.avgIntensity?.toString() ?? "—"}
                  context="Across filtered dataset"
                  accent="brand"
                />
                <KpiCard
                  icon={TrendingUp}
                  label="Avg Likelihood"
                  value={data.summary.avgLikelihood?.toString() ?? "—"}
                  context="Across filtered dataset"
                  accent="sky"
                />
                <KpiCard
                  icon={Target}
                  label="Avg Relevance"
                  value={data.summary.avgRelevance?.toString() ?? "—"}
                  context="Across filtered dataset"
                  accent="amber"
                />
                <KpiCard
                  icon={Database}
                  label="Total Insights"
                  value={data.summary.total.toLocaleString()}
                  context="Records analyzed in current selection"
                  accent="emerald"
                />
              </>
            )}
          </div>

          <div className="mb-6">
            <KeySignals signals={data?.keySignals ?? []} isLoading={isLoading} />
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <ChartCard
              title="Trend Over Time"
              subtitle="Average intensity & likelihood by end year"
              isLoading={isLoading}
              isEmpty={!isLoading && (data?.year.length ?? 0) === 0}
              className="lg:col-span-2"
              minHeight={360}
            >
              <TimeChart data={data?.year ?? []} missingCount={data?.meta.missingEndYearCount ?? 0} totalCount={data?.summary.total ?? 0} />
            </ChartCard>

            <ChartCard
              title="PESTLE Distribution"
              subtitle="Category breakdown of current selection"
              isLoading={isLoading}
              isEmpty={!isLoading && (data?.pestle.length ?? 0) === 0}
              minHeight={360}
            >
              <PestleChart data={data?.pestle ?? []} onSelect={(v) => setFilter("pestle", v)} />
            </ChartCard>
          </div>

          <div className="mt-5">
            <ChartCard
              title="Sector Intelligence"
              subtitle="Insight count, average intensity and average relevance by sector"
              isLoading={isLoading}
              isEmpty={!isLoading && (data?.sector.length ?? 0) === 0}
            >
              <SectorChart data={data?.sector ?? []} onSelectSector={(v) => setFilter("sector", v)} />
            </ChartCard>
          </div>
        </>
      )}

      <InsightDrawer insightId={selectedInsight} onClose={() => setSelectedInsight(null)} />
    </div>
  );
}

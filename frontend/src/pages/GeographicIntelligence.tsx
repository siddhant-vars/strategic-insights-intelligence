import { useAnalytics } from "@/api/queries";
import { useFilters } from "@/hooks/useFilters";
import { FilterToolbar } from "@/components/filters/FilterToolbar";
import { PageHeader } from "@/components/common/MetricBadge";
import { ChartCard } from "@/components/common/ChartCard";
import { GeoChart } from "@/components/charts/GeoChart";
import { ErrorState } from "@/components/common/EmptyState";

export default function GeographicIntelligence() {
  const { toQueryParams, setFilter } = useFilters();
  const { data, isLoading, isError, refetch } = useAnalytics(toQueryParams());

  const missingCountry = data?.meta.missingCountryCount ?? 0;

  return (
    <div>
      <PageHeader
        title="Geographic Intelligence"
        description="Insight density and average intensity by region and country, based only on records with recorded geography."
      />
      <FilterToolbar />

      {isError ? (
        <ErrorState message="Could not load geographic analytics." onRetry={() => refetch()} />
      ) : (
        <ChartCard
          title="Insights by Location"
          subtitle="Ranked by insight count · click a bar to filter"
          isLoading={isLoading}
          isEmpty={!isLoading && (data?.region.length ?? 0) === 0 && (data?.country.length ?? 0) === 0}
          minHeight={420}
        >
          <GeoChart
            regionData={data?.region ?? []}
            countryData={data?.country ?? []}
            onSelectRegion={(v) => setFilter("region", v)}
            onSelectCountry={(v) => setFilter("country", v)}
          />
          {!isLoading && missingCountry > 0 && (
            <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
              {missingCountry} of {data?.summary.total ?? 0} insights in the current selection have no recorded country
              and are not represented in the country view above.
            </p>
          )}
        </ChartCard>
      )}
    </div>
  );
}

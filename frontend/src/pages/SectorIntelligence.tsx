import { useAnalytics } from "@/api/queries";
import { useFilters } from "@/hooks/useFilters";
import { FilterToolbar } from "@/components/filters/FilterToolbar";
import { PageHeader } from "@/components/common/MetricBadge";
import { ChartCard } from "@/components/common/ChartCard";
import { SectorChart } from "@/components/charts/SectorChart";
import { TopicSourceChart } from "@/components/charts/TopicSourceChart";
import { ErrorState } from "@/components/common/EmptyState";

export default function SectorIntelligence() {
  const { toQueryParams, setFilter } = useFilters();
  const { data, isLoading, isError, refetch } = useAnalytics(toQueryParams());

  return (
    <div>
      <PageHeader
        title="Sector Intelligence"
        description="Compare sectors by volume of strategic insights and their average intensity or relevance, then drill into topics and sources."
      />
      <FilterToolbar />

      {isError ? (
        <ErrorState message="Could not load sector analytics." onRetry={() => refetch()} />
      ) : (
        <div className="space-y-5">
          <ChartCard
            title="Sector Breakdown"
            subtitle="Insight count · avg intensity · avg relevance — switch metric below"
            isLoading={isLoading}
            isEmpty={!isLoading && (data?.sector.length ?? 0) === 0}
            minHeight={400}
          >
            <SectorChart data={data?.sector ?? []} onSelectSector={(v) => setFilter("sector", v)} />
          </ChartCard>

          <ChartCard
            title="Topic & Source Intelligence"
            subtitle="Most represented topics or sources in the current selection"
            isLoading={isLoading}
            isEmpty={!isLoading && (data?.topic.length ?? 0) === 0 && (data?.source.length ?? 0) === 0}
            minHeight={380}
          >
            <TopicSourceChart
              topicData={data?.topic ?? []}
              sourceData={data?.source ?? []}
              onSelectTopic={(v) => setFilter("topic", v)}
              onSelectSource={(v) => setFilter("source", v)}
            />
          </ChartCard>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useAnalytics } from "@/api/queries";
import { useFilters } from "@/hooks/useFilters";
import { FilterToolbar } from "@/components/filters/FilterToolbar";
import { PageHeader } from "@/components/common/MetricBadge";
import { ChartCard } from "@/components/common/ChartCard";
import { RiskMatrixChart } from "@/components/charts/RiskMatrixChart";
import { ErrorState } from "@/components/common/EmptyState";
import { InsightDrawer } from "@/components/drawer/InsightDrawer";

export default function RiskMatrixPage() {
  const { toQueryParams } = useFilters();
  const { data, isLoading, isError, refetch } = useAnalytics(toQueryParams());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div>
      <PageHeader
        title="Strategic Risk Matrix"
        description="Every insight plotted by likelihood (x) and intensity (y); bubble size reflects relevance and color reflects PESTLE category. Click a point for full detail."
      />
      <FilterToolbar />

      {isError ? (
        <ErrorState message="Could not load risk matrix data." onRetry={() => refetch()} />
      ) : (
        <ChartCard
          title="Likelihood vs Intensity"
          subtitle={`${data?.riskMatrix.length ?? 0} insights with complete intensity, likelihood and relevance scores`}
          isLoading={isLoading}
          isEmpty={!isLoading && (data?.riskMatrix.length ?? 0) === 0}
          minHeight={480}
        >
          <RiskMatrixChart points={data?.riskMatrix ?? []} onSelect={setSelectedId} />
        </ChartCard>
      )}

      <InsightDrawer insightId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}

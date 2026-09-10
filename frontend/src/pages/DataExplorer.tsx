import { useState } from "react";
import { useInsightsList } from "@/api/queries";
import { useFilters } from "@/hooks/useFilters";
import { FilterToolbar } from "@/components/filters/FilterToolbar";
import { PageHeader } from "@/components/common/MetricBadge";
import { DataTable } from "@/components/table/DataTable";
import { InsightDrawer } from "@/components/drawer/InsightDrawer";
import { ErrorState } from "@/components/common/EmptyState";
import { Insight } from "@/types/insight";

export default function DataExplorer() {
  const { toQueryParams } = useFilters();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("endYear");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<Insight | null>(null);

  const params = toQueryParams({
    page: String(page),
    limit: "20",
    sortBy,
    sortOrder,
  });

  const { data, isLoading, isError, refetch } = useInsightsList(params);

  function handleSort(key: string) {
    if (sortBy === key) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
    setPage(1);
  }

  return (
    <div>
      <PageHeader
        title="Data Explorer"
        description="Browse, search, sort and filter the full underlying dataset record by record."
      />
      <FilterToolbar />

      {isError ? (
        <ErrorState message="Could not load insights." onRetry={() => refetch()} />
      ) : (
        <DataTable
          rows={data?.data ?? []}
          isLoading={isLoading}
          page={data?.pagination.page ?? page}
          totalPages={data?.pagination.totalPages ?? 1}
          total={data?.pagination.total ?? 0}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onPageChange={setPage}
          onRowClick={setSelected}
        />
      )}

      <InsightDrawer insightId={selected?.id ?? null} onClose={() => setSelected(null)} />
    </div>
  );
}

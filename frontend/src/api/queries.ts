import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import { AnalyticsResponse, FilterOptions, Insight, InsightListResponse } from "@/types/insight";

export function useFilterOptions() {
  return useQuery({
    queryKey: ["filters"],
    queryFn: async () => {
      const { data } = await apiClient.get<FilterOptions>("/insights/filters");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalytics(params: URLSearchParams) {
  const key = params.toString();
  return useQuery({
    queryKey: ["analytics", key],
    queryFn: async () => {
      const { data } = await apiClient.get<AnalyticsResponse>(`/insights/analytics?${key}`);
      return data;
    },
    placeholderData: (prev) => prev,
  });
}

export function useInsightsList(params: URLSearchParams) {
  const key = params.toString();
  return useQuery({
    queryKey: ["insights", key],
    queryFn: async () => {
      const { data } = await apiClient.get<InsightListResponse>(`/insights?${key}`);
      return data;
    },
    placeholderData: (prev) => prev,
  });
}

export function useInsightDetail(id: string | null) {
  return useQuery({
    queryKey: ["insight", id],
    queryFn: async () => {
      const { data } = await apiClient.get<Insight>(`/insights/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

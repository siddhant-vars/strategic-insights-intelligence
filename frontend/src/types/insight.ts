export type IntensityLevel = "Low" | "Medium" | "High" | "Critical";

export interface Insight {
  id: string;
  title: string;
  insightText: string | null;
  sector: string | null;
  topic: string | null;
  region: string | null;
  country: string | null;
  city: string | null;
  pestle: string | null;
  source: string | null;
  swot: string | null;
  intensity: number | null;
  likelihood: number | null;
  relevance: number | null;
  impact: number | null;
  startYear: number | null;
  endYear: number | null;
  added: string | null;
  published: string | null;
  url: string | null;
  intensityLevel: IntensityLevel | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface InsightListResponse {
  data: Insight[];
  pagination: Pagination;
}

export interface FilterOptions {
  endYears: number[];
  topics: string[];
  sectors: string[];
  regions: string[];
  pestles: string[];
  sources: string[];
  countries: string[];
  cities: string[];
  swots: string[];
  meta: {
    cityAvailable: boolean;
    swotAvailable: boolean;
  };
}

export interface GroupCount {
  key: string;
  count: number;
  avgIntensity: number | null;
  avgRelevance?: number | null;
  avgLikelihood?: number | null;
}

export interface RiskPoint {
  id: string;
  title: string;
  sector: string | null;
  topic: string | null;
  country: string | null;
  pestle: string | null;
  intensity: number;
  likelihood: number;
  relevance: number;
}

export interface YearPoint {
  year: number;
  count: number;
  avgIntensity: number | null;
  avgLikelihood: number | null;
}

export interface AnalyticsResponse {
  summary: {
    total: number;
    avgIntensity: number | null;
    avgLikelihood: number | null;
    avgRelevance: number | null;
    sectorCount: number;
    regionCount: number;
    countryCount: number;
  };
  sector: GroupCount[];
  topic: GroupCount[];
  pestle: GroupCount[];
  region: GroupCount[];
  country: GroupCount[];
  source: GroupCount[];
  year: YearPoint[];
  riskMatrix: RiskPoint[];
  keySignals: string[];
  meta: {
    missingEndYearCount: number;
    missingCountryCount: number;
    swotAvailable: boolean;
    cityAvailable: boolean;
  };
}

export const FILTER_KEYS = [
  "end_year",
  "topic",
  "sector",
  "region",
  "pestle",
  "source",
  "country",
  "city",
  "swot",
  "q",
] as const;

export type FilterKey = (typeof FILTER_KEYS)[number];

export type ActiveFilters = Partial<Record<FilterKey, string>>;

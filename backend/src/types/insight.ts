/**
 * Canonical shape of a normalized Insight record, as stored in MongoDB.
 *
 * Source dataset reality (verified by inspecting jsondata.json directly,
 * 1000 records total):
 *  - There is NO `city` field anywhere in the raw dataset.
 *  - There is NO `swot` field anywhere in the raw dataset.
 *  - `end_year` / `start_year` are frequently empty strings ("").
 *  - `intensity` / `likelihood` are frequently empty strings ("") - 38 of 1000.
 *  - `country` is empty in 650 of 1000 records.
 *  - `region` is empty in 453 of 1000 records, and contains a casing
 *    inconsistency ("World" vs "world") which we normalize.
 *  - `impact` is only present on 34 of 1000 records with values {2,3,4}.
 *
 * We deliberately keep `city` and `swot` as optional/always-null fields in
 * the schema (rather than omitting them) so the API contract documented in
 * the assignment (filters for City & SWOT) can still be implemented - just
 * honestly, returning empty option lists and an explicit "not available in
 * source data" state instead of inventing values. See README.md, section
 * "Data Normalization & SWOT Decisions" for the full writeup.
 */
export interface NormalizedInsight {
  title: string;
  insightText: string | null;
  sector: string | null;
  topic: string | null;
  region: string | null;
  country: string | null;
  city: string | null; // Always null - field absent from source dataset.
  pestle: string | null;
  source: string | null;
  swot: string | null; // Always null - field absent from source dataset.
  intensity: number | null;
  likelihood: number | null;
  relevance: number | null;
  impact: number | null;
  startYear: number | null;
  endYear: number | null;
  added: Date | null;
  published: Date | null;
  url: string | null;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface InsightFilters {
  end_year?: string;
  topic?: string;
  sector?: string;
  region?: string;
  pestle?: string;
  source?: string;
  country?: string;
  city?: string;
  swot?: string;
  q?: string;
}

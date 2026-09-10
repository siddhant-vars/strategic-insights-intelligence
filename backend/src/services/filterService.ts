import { FilterQuery } from "mongoose";
import { InsightDocument } from "../models/Insight";

/**
 * Splits a comma-separated query param into a trimmed array, supporting the
 * multi-select filters described in the assignment (e.g. ?topic=gas,oil).
 */
function splitParam(value: unknown): string[] | undefined {
  if (typeof value !== "string" || value.trim().length === 0) return undefined;
  const parts = value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : undefined;
}

export interface RawQuery {
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

/**
 * Builds a MongoDB filter document from raw request query parameters.
 * All filters are optional and combine with AND semantics; each individual
 * filter supports multiple comma-separated values (OR semantics within the
 * same field), matching the "searchable, multi-select" filter UX required
 * by the assignment.
 */
export function buildInsightFilter(query: RawQuery): FilterQuery<InsightDocument> {
  const filter: FilterQuery<InsightDocument> = {};

  const topics = splitParam(query.topic);
  if (topics) filter.topic = { $in: topics };

  const sectors = splitParam(query.sector);
  if (sectors) filter.sector = { $in: sectors };

  const regions = splitParam(query.region);
  if (regions) filter.region = { $in: regions };

  const pestles = splitParam(query.pestle);
  if (pestles) filter.pestle = { $in: pestles };

  const sources = splitParam(query.source);
  if (sources) filter.source = { $in: sources };

  const countries = splitParam(query.country);
  if (countries) filter.country = { $in: countries };

  const cities = splitParam(query.city);
  if (cities) filter.city = { $in: cities };

  const swots = splitParam(query.swot);
  if (swots) filter.swot = { $in: swots };

  const years = splitParam(query.end_year);
  if (years) {
    const numericYears = years.map(Number).filter((n) => Number.isFinite(n));
    if (numericYears.length > 0) filter.endYear = { $in: numericYears };
  }

  if (typeof query.q === "string" && query.q.trim().length > 0) {
    filter.$text = { $search: query.q.trim() };
  }

  return filter;
}

import { FilterQuery, PipelineStage } from "mongoose";
import { Insight, InsightDocument } from "../models/Insight";

const round2 = (n: number | null | undefined): number | null =>
  typeof n === "number" && Number.isFinite(n) ? Math.round(n * 100) / 100 : null;

interface SummaryResult {
  total: number;
  avgIntensity: number | null;
  avgLikelihood: number | null;
  avgRelevance: number | null;
  sectorCount: number;
  regionCount: number;
  countryCount: number;
}

interface GroupCount {
  key: string;
  count: number;
  avgIntensity: number | null;
  avgRelevance?: number | null;
  avgLikelihood?: number | null;
}

interface RiskPoint {
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

interface YearPoint {
  year: number;
  count: number;
  avgIntensity: number | null;
  avgLikelihood: number | null;
}

export interface AnalyticsResult {
  summary: SummaryResult;
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

async function groupBy(
  filter: FilterQuery<InsightDocument>,
  field: keyof InsightDocument,
  extra: { avgRelevance?: boolean; avgLikelihood?: boolean } = {}
): Promise<GroupCount[]> {
  const group: Record<string, unknown> = {
    _id: `$${String(field)}`,
    count: { $sum: 1 },
    avgIntensity: { $avg: "$intensity" },
  };
  if (extra.avgRelevance) group.avgRelevance = { $avg: "$relevance" };
  if (extra.avgLikelihood) group.avgLikelihood = { $avg: "$likelihood" };

  // IMPORTANT: combine via $and rather than object-spreading `filter` and
  // `{ [field]: { $ne: null } }` together. A plain spread
  // (`{ ...filter, [field]: { $ne: null } }`) silently overwrites any
  // existing constraint on `field` within `filter` (e.g. grouping by
  // "sector" while the user has also filtered by sector=Energy), because
  // both would occupy the same object key and the later one wins. Using
  // $and keeps both constraints independently enforced.
  const pipeline: PipelineStage[] = [
    { $match: { $and: [filter, { [field]: { $ne: null } }] } },
    { $group: group as PipelineStage.Group["$group"] },
    { $sort: { count: -1 } },
  ];

  const rows = await Insight.aggregate(pipeline);
  return rows.map((r) => ({
    key: r._id as string,
    count: r.count as number,
    avgIntensity: round2(r.avgIntensity),
    ...(extra.avgRelevance ? { avgRelevance: round2(r.avgRelevance) } : {}),
    ...(extra.avgLikelihood ? { avgLikelihood: round2(r.avgLikelihood) } : {}),
  }));
}

async function getSummary(filter: FilterQuery<InsightDocument>): Promise<SummaryResult> {
  const [agg] = await Insight.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        avgIntensity: { $avg: "$intensity" },
        avgLikelihood: { $avg: "$likelihood" },
        avgRelevance: { $avg: "$relevance" },
        sectors: { $addToSet: "$sector" },
        regions: { $addToSet: "$region" },
        countries: { $addToSet: "$country" },
      },
    },
  ]);

  if (!agg) {
    return {
      total: 0,
      avgIntensity: null,
      avgLikelihood: null,
      avgRelevance: null,
      sectorCount: 0,
      regionCount: 0,
      countryCount: 0,
    };
  }

  const nonNull = (arr: unknown[]) => arr.filter((v) => v !== null && v !== undefined).length;

  return {
    total: agg.total,
    avgIntensity: round2(agg.avgIntensity),
    avgLikelihood: round2(agg.avgLikelihood),
    avgRelevance: round2(agg.avgRelevance),
    sectorCount: nonNull(agg.sectors),
    regionCount: nonNull(agg.regions),
    countryCount: nonNull(agg.countries),
  };
}

async function getYearTrend(filter: FilterQuery<InsightDocument>): Promise<YearPoint[]> {
  const rows = await Insight.aggregate([
    // Same $and fix as groupBy() above - avoids silently dropping an
    // active end_year filter when it collides with the endYear-not-null
    // condition needed for the trend itself.
    { $match: { $and: [filter, { endYear: { $ne: null } }] } },
    {
      $group: {
        _id: "$endYear",
        count: { $sum: 1 },
        avgIntensity: { $avg: "$intensity" },
        avgLikelihood: { $avg: "$likelihood" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  return rows.map((r) => ({
    year: r._id as number,
    count: r.count as number,
    avgIntensity: round2(r.avgIntensity),
    avgLikelihood: round2(r.avgLikelihood),
  }));
}

async function getRiskMatrix(filter: FilterQuery<InsightDocument>): Promise<RiskPoint[]> {
  const rows = await Insight.find({
    $and: [filter, { intensity: { $ne: null } }, { likelihood: { $ne: null } }, { relevance: { $ne: null } }],
  })
    .select("title sector topic country pestle intensity likelihood relevance")
    .limit(500) // cap payload size; this dataset maxes at 1000 rows anyway
    .lean();

  return rows.map((r) => ({
    id: String(r._id),
    title: r.title,
    sector: r.sector,
    topic: r.topic,
    country: r.country,
    pestle: r.pestle,
    intensity: r.intensity as number,
    likelihood: r.likelihood as number,
    relevance: r.relevance as number,
  }));
}

function buildKeySignals(
  summary: SummaryResult,
  sector: GroupCount[],
  region: GroupCount[],
  pestle: GroupCount[],
  country: GroupCount[],
  topHighestIntensity: { title: string; intensity: number } | null
): string[] {
  const signals: string[] = [];

  if (summary.total === 0) {
    return ["No insights match the current filters. Try broadening your selection."];
  }

  if (sector.length > 0) {
    const top = sector[0];
    signals.push(
      `"${top.key}" is the most represented sector in the current selection, with ${top.count} insight${
        top.count === 1 ? "" : "s"
      } (${Math.round((top.count / summary.total) * 100)}% of the filtered set).`
    );
  }

  if (region.length > 0) {
    const top = region[0];
    signals.push(`"${top.key}" contains the highest number of recorded insights among known regions, with ${top.count}.`);
  }

  if (pestle.length > 0) {
    const top = pestle[0];
    signals.push(`"${top.key}" is the dominant PESTLE category, accounting for ${top.count} insight${top.count === 1 ? "" : "s"}.`);
  }

  if (topHighestIntensity) {
    signals.push(
      `The highest-intensity insight in the current selection, "${topHighestIntensity.title}", has an intensity score of ${topHighestIntensity.intensity}.`
    );
  }

  if (country.length > 0) {
    const top = country[0];
    signals.push(`Among records with known country data, "${top.key}" has the most insights (${top.count}).`);
  }

  return signals.slice(0, 5);
}

export async function getAnalytics(filter: FilterQuery<InsightDocument>): Promise<AnalyticsResult> {
  const [summary, sector, topic, pestle, region, country, source, year, riskMatrix, missingEndYearCount, missingCountryCount] =
    await Promise.all([
      getSummary(filter),
      groupBy(filter, "sector", { avgRelevance: true }),
      groupBy(filter, "topic"),
      groupBy(filter, "pestle"),
      groupBy(filter, "region"),
      groupBy(filter, "country"),
      groupBy(filter, "source"),
      getYearTrend(filter),
      getRiskMatrix(filter),
      Insight.countDocuments({ $and: [filter, { endYear: null }] }),
      Insight.countDocuments({ $and: [filter, { country: null }] }),
    ]);

  const [highestIntensityDoc] = await Insight.find({ $and: [filter, { intensity: { $ne: null } }] })
    .sort({ intensity: -1 })
    .limit(1)
    .select("title intensity")
    .lean();

  const keySignals = buildKeySignals(
    summary,
    sector,
    region,
    pestle,
    country,
    highestIntensityDoc ? { title: highestIntensityDoc.title, intensity: highestIntensityDoc.intensity as number } : null
  );

  // SWOT / city presence is a property of the whole dataset, not the current
  // filter, so we check it independently and cheaply via countDocuments.
  const [swotCount, cityCount] = await Promise.all([
    Insight.countDocuments({ swot: { $ne: null } }),
    Insight.countDocuments({ city: { $ne: null } }),
  ]);

  return {
    summary,
    sector,
    topic: topic.slice(0, 30),
    pestle,
    region,
    country: country.slice(0, 30),
    source: source.slice(0, 30),
    year,
    riskMatrix,
    keySignals,
    meta: {
      missingEndYearCount,
      missingCountryCount,
      swotAvailable: swotCount > 0,
      cityAvailable: cityCount > 0,
    },
  };
}

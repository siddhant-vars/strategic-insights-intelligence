import { Insight } from "../models/Insight";

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

export async function getFilterOptions(): Promise<FilterOptions> {
  const [endYears, topics, sectors, regions, pestles, sources, countries, cities, swots] = await Promise.all([
    Insight.distinct("endYear", { endYear: { $ne: null } }),
    Insight.distinct("topic", { topic: { $ne: null } }),
    Insight.distinct("sector", { sector: { $ne: null } }),
    Insight.distinct("region", { region: { $ne: null } }),
    Insight.distinct("pestle", { pestle: { $ne: null } }),
    Insight.distinct("source", { source: { $ne: null } }),
    Insight.distinct("country", { country: { $ne: null } }),
    Insight.distinct("city", { city: { $ne: null } }),
    Insight.distinct("swot", { swot: { $ne: null } }),
  ]);

  return {
    endYears: (endYears as number[]).sort((a, b) => a - b),
    topics: (topics as string[]).sort(),
    sectors: (sectors as string[]).sort(),
    regions: (regions as string[]).sort(),
    pestles: (pestles as string[]).sort(),
    sources: (sources as string[]).sort(),
    countries: (countries as string[]).sort(),
    cities: (cities as string[]).sort(),
    swots: (swots as string[]).sort(),
    meta: {
      cityAvailable: cities.length > 0,
      swotAvailable: swots.length > 0,
    },
  };
}

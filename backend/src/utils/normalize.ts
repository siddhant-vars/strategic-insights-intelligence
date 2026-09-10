/**
 * Normalization helpers.
 *
 * Rules (documented in README.md as required by the assignment):
 *  1. Empty strings ("") for any field become `null` - never fabricated.
 *  2. Numeric fields (intensity/likelihood/relevance/impact/start_year/
 *     end_year) are safely parsed; non-numeric / empty values become `null`,
 *     never coerced to 0 (0 is a legitimate value for some fields, so
 *     treating missing-as-zero would corrupt averages).
 *  3. Categorical string fields are trimmed. A small set of known casing
 *     inconsistencies observed in the raw data (e.g. region "world" vs
 *     "World") are normalized to a single canonical casing so they don't
 *     silently fragment groupings in aggregations. No new categories are
 *     invented - this only merges values that are clearly the same label.
 *  4. Date fields ("added", "published") are parsed from the dataset's
 *     "Month, DD YYYY HH:mm:ss" format into real Date objects; unparseable
 *     values become `null`.
 */

export function toNullableString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

/** Merge known case-variants for categorical fields without inventing data. */
const CASING_FIXUPS: Record<string, string> = {
  world: "World",
};

export function normalizeCategory(value: unknown): string | null {
  const str = toNullableString(value);
  if (str === null) return null;
  const lower = str.toLowerCase();
  return CASING_FIXUPS[lower] ?? str;
}

export function toNullableNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function toNullableYear(value: unknown): number | null {
  const num = toNullableNumber(value);
  if (num === null) return null;
  // Sanity bound - the raw data does contain a couple of far-future
  // projection years (e.g. 2126, 2200) which are legitimate scenario years
  // for long-range energy/climate outlooks, so we do not clip them, only
  // reject obviously corrupt values (negative or absurdly small).
  if (num < 1900) return null;
  return Math.round(num);
}

export function toNullableDate(value: unknown): Date | null {
  const str = toNullableString(value);
  if (str === null) return null;
  const parsed = new Date(str);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

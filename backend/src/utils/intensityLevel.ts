/**
 * Intensity level classification.
 *
 * The raw dataset's `intensity` field is NOT a 0-10 scale as one might
 * assume - inspection of all 962 numeric values shows a range of 1 to 96,
 * heavily right-skewed (median 8, 75th percentile 12, 95th percentile 20).
 *
 * Thresholds below are derived directly from the actual quartile
 * distribution of this dataset (25th / 50th / 75th percentiles), so the
 * four buckets are meaningful and roughly balanced rather than arbitrary:
 *
 *   Low       intensity <= 4   (bottom quartile)
 *   Medium    intensity 5-8    (25th-50th percentile)
 *   High      intensity 9-12   (50th-75th percentile)
 *   Critical  intensity > 12   (top quartile)
 *
 * This exact rule is used consistently by both the API (status pills in the
 * Data Explorer) and the frontend as a fallback if it ever needs to
 * recompute client-side, so labels never disagree.
 */
export type IntensityLevel = "Low" | "Medium" | "High" | "Critical";

export function getIntensityLevel(intensity: number | null): IntensityLevel | null {
  if (intensity === null) return null;
  if (intensity <= 4) return "Low";
  if (intensity <= 8) return "Medium";
  if (intensity <= 12) return "High";
  return "Critical";
}

export const INTENSITY_THRESHOLDS = {
  low: 4,
  medium: 8,
  high: 12,
} as const;

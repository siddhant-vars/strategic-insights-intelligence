/* eslint-disable no-console */
import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db";
import { Insight } from "../src/models/Insight";
import { toNullableString, normalizeCategory, toNullableNumber, toNullableYear, toNullableDate } from "../src/utils/normalize";

interface RawRecord {
  title?: unknown;
  insight?: unknown;
  sector?: unknown;
  topic?: unknown;
  region?: unknown;
  country?: unknown;
  city?: unknown;
  pestle?: unknown;
  source?: unknown;
  swot?: unknown;
  intensity?: unknown;
  likelihood?: unknown;
  relevance?: unknown;
  impact?: unknown;
  start_year?: unknown;
  end_year?: unknown;
  added?: unknown;
  published?: unknown;
  url?: unknown;
}

const DATA_PATH = path.resolve(__dirname, "../../jsondata.json");
const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/strategic_insights";

interface NormalizationIssue {
  index: number;
  title: string;
  issues: string[];
}

function normalizeRecord(raw: RawRecord, index: number, issueLog: NormalizationIssue[]) {
  const issues: string[] = [];

  const title = toNullableString(raw.title);
  if (!title) {
    issues.push("missing title - record skipped (title is required)");
  }

  const intensity = toNullableNumber(raw.intensity);
  if (raw.intensity !== undefined && raw.intensity !== "" && intensity === null) {
    issues.push(`unparseable intensity value: ${JSON.stringify(raw.intensity)}`);
  }

  const likelihood = toNullableNumber(raw.likelihood);
  const relevance = toNullableNumber(raw.relevance);
  const impact = toNullableNumber(raw.impact);
  const startYear = toNullableYear(raw.start_year);
  const endYear = toNullableYear(raw.end_year);
  const added = toNullableDate(raw.added);
  const published = toNullableDate(raw.published);

  if (issues.length > 0) {
    issueLog.push({ index, title: title ?? "(untitled)", issues });
  }

  return {
    title,
    insightText: toNullableString(raw.insight),
    sector: normalizeCategory(raw.sector),
    topic: normalizeCategory(raw.topic),
    region: normalizeCategory(raw.region),
    country: normalizeCategory(raw.country),
    // `city` does not exist in the source dataset at all. We normalize
    // defensively in case a future data drop introduces it, but for the
    // current dataset this will always resolve to null.
    city: normalizeCategory((raw as Record<string, unknown>).city),
    pestle: normalizeCategory(raw.pestle),
    source: toNullableString(raw.source),
    // `swot` does not exist in the source dataset. Same defensive handling
    // as `city` above - see README "SWOT Handling Decision".
    swot: normalizeCategory((raw as Record<string, unknown>).swot),
    intensity,
    likelihood,
    relevance,
    impact,
    startYear,
    endYear,
    added,
    published,
    url: toNullableString(raw.url),
  };
}

async function seed() {
  console.log("=== Strategic Insights - Database Seed ===");
  console.log(`Reading dataset from: ${DATA_PATH}`);

  if (!fs.existsSync(DATA_PATH)) {
    console.error(`ERROR: jsondata.json not found at ${DATA_PATH}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  let records: RawRecord[];
  try {
    records = JSON.parse(raw);
  } catch (e) {
    console.error("ERROR: jsondata.json is not valid JSON:", (e as Error).message);
    process.exit(1);
  }

  if (!Array.isArray(records)) {
    console.error("ERROR: expected jsondata.json to contain a top-level array of records.");
    process.exit(1);
  }

  console.log(`Records read: ${records.length}`);

  const issueLog: NormalizationIssue[] = [];
  const normalized = records.map((r, i) => normalizeRecord(r, i, issueLog));

  const toInsert = normalized.filter((r) => r.title !== null);
  const skipped = normalized.length - toInsert.length;

  await connectDB(MONGODB_URI);

  // Idempotency: this seed script fully replaces the insights collection on
  // every run rather than attempting fragile per-record upserts (the source
  // dataset has no stable natural key - titles are unique in this snapshot
  // but that's not a contract we can rely on). Running `npm run seed`
  // multiple times always converges to the same end state.
  const existingCount = await Insight.countDocuments();
  if (existingCount > 0) {
    console.log(`Existing collection has ${existingCount} documents - clearing before re-seed (idempotent reseed).`);
    await Insight.deleteMany({});
  }

  const BATCH_SIZE = 500;
  let inserted = 0;
  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    const batch = toInsert.slice(i, i + BATCH_SIZE);
    const result = await Insight.insertMany(batch, { ordered: false });
    inserted += result.length;
  }

  console.log("\n=== Seed Report ===");
  console.log(`Records read:        ${records.length}`);
  console.log(`Records inserted:    ${inserted}`);
  console.log(`Records skipped:     ${skipped} (missing required title)`);
  console.log(`Normalization notes: ${issueLog.length} records had a value that needed normalization`);

  if (issueLog.length > 0) {
    console.log("\nSample normalization notes (first 5):");
    issueLog.slice(0, 5).forEach((entry) => {
      console.log(`  [#${entry.index}] "${entry.title}": ${entry.issues.join("; ")}`);
    });
  }

  console.log("\nSeed complete.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

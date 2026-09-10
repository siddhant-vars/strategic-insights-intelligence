import { Schema, model, Document } from "mongoose";

export interface InsightDocument extends Document {
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
  added: Date | null;
  published: Date | null;
  url: string | null;
}

const InsightSchema = new Schema<InsightDocument>(
  {
    title: { type: String, required: true },
    insightText: { type: String, default: null },
    sector: { type: String, default: null, index: true },
    topic: { type: String, default: null, index: true },
    region: { type: String, default: null, index: true },
    country: { type: String, default: null, index: true },
    city: { type: String, default: null, index: true },
    pestle: { type: String, default: null, index: true },
    source: { type: String, default: null, index: true },
    swot: { type: String, default: null, index: true },
    intensity: { type: Number, default: null },
    likelihood: { type: Number, default: null },
    relevance: { type: Number, default: null },
    impact: { type: Number, default: null },
    startYear: { type: Number, default: null },
    endYear: { type: Number, default: null, index: true },
    added: { type: Date, default: null },
    published: { type: Date, default: null },
    url: { type: String, default: null },
  },
  { timestamps: true }
);

// Text index to support the `q` free-text search parameter across the
// fields a user is most likely to search by.
InsightSchema.index({ title: "text", insightText: "text", topic: "text" });

InsightSchema.index({ sector: 1, region: 1 });

export const Insight = model<InsightDocument>("Insight", InsightSchema);

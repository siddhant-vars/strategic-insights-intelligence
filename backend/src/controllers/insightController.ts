import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Insight } from "../models/Insight";
import { buildInsightFilter } from "../services/filterService";
import { getAnalytics } from "../services/analyticsService";
import { getFilterOptions } from "../services/filterOptionsService";
import { getIntensityLevel } from "../utils/intensityLevel";
import { ApiError } from "../middleware/errorHandler";

const ALLOWED_SORT_FIELDS = new Set([
  "title",
  "sector",
  "topic",
  "region",
  "country",
  "intensity",
  "likelihood",
  "relevance",
  "endYear",
  "added",
  "published",
]);

export async function listInsights(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit ?? "20"), 10) || 20));
    const sortByRaw = String(req.query.sortBy ?? "endYear");
    const sortBy = ALLOWED_SORT_FIELDS.has(sortByRaw) ? sortByRaw : "endYear";
    const sortOrder = String(req.query.sortOrder ?? "desc") === "asc" ? 1 : -1;

    const filter = buildInsightFilter(req.query as Record<string, string>);

    const [data, total] = await Promise.all([
      Insight.find(filter)
        .sort({ [sortBy]: sortOrder, _id: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Insight.countDocuments(filter),
    ]);

    const enriched = data.map((d) => ({
      ...d,
      id: String(d._id),
      intensityLevel: getIntensityLevel(d.intensity ?? null),
    }));

    res.json({
      data: enriched,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getInsightById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid insight id");
    }
    const doc = await Insight.findById(id).lean();
    if (!doc) throw new ApiError(404, "Insight not found");
    res.json({
      ...doc,
      id: String(doc._id),
      intensityLevel: getIntensityLevel(doc.intensity ?? null),
    });
  } catch (err) {
    next(err);
  }
}

export async function getFilters(_req: Request, res: Response, next: NextFunction) {
  try {
    const options = await getFilterOptions();
    res.json(options);
  } catch (err) {
    next(err);
  }
}

export async function getInsightAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const filter = buildInsightFilter(req.query as Record<string, string>);
    const analytics = await getAnalytics(filter);
    res.json(analytics);
  } catch (err) {
    next(err);
  }
}

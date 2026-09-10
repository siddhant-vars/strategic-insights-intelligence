import { Router } from "express";
import { listInsights, getInsightById, getFilters, getInsightAnalytics } from "../controllers/insightController";

const router = Router();

router.get("/insights/filters", getFilters);
router.get("/insights/analytics", getInsightAnalytics);
router.get("/insights/:id", getInsightById);
router.get("/insights", listInsights);

export default router;

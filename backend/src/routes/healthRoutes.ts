import { Router, Request, Response } from "express";
import { isDBConnected } from "../config/db";

const router = Router();

router.get("/health", (_req: Request, res: Response) => {
  const dbConnected = isDBConnected();
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? "ok" : "degraded",
    db: dbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

export default router;

import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import insightRoutes from "./routes/insightRoutes";
import healthRoutes from "./routes/healthRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export function createApp(): Application {
  const app = express();

  const corsOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((o) => o.trim());

  app.use(helmet());
  app.use(cors({ origin: corsOrigins }));
  app.use(express.json());
  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  app.use("/api", healthRoutes);
  app.use("/api", insightRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

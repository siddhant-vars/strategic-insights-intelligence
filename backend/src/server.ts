import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app";
import { connectDB } from "./config/db";

const PORT = Number(process.env.PORT ?? 5001);
const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/strategic_insights";

async function start() {
  const app = createApp();

  try {
    await connectDB(MONGODB_URI);
  } catch (err) {
    // Graceful startup failure: log clearly and exit non-zero rather than
    // running a server that will 500 on every DB-backed request.
    console.error(
      "[server] Could not connect to MongoDB. Check MONGODB_URI in your .env file and that MongoDB is running."
    );
    process.exit(1);
  }

  app.listen(PORT, () => {

    console.log(`[server] Strategic Insights API listening on http://localhost:${PORT}`);
  });
}

start();

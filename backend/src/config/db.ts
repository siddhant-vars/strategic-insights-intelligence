import mongoose from "mongoose";

export async function connectDB(uri: string): Promise<void> {
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(uri);
    // eslint-disable-next-line no-console
    console.log(`[db] connected to MongoDB (${mongoose.connection.name})`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[db] failed to connect to MongoDB:", (err as Error).message);
    throw err;
  }
}

export function isDBConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

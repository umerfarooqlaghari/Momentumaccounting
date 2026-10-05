import mongoose from "mongoose";

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

// Reuse the connection across hot reloads in dev and across invocations in serverless.
const globalForMongoose = globalThis as unknown as { mongooseCache?: Cache };
const cache: Cache = globalForMongoose.mongooseCache ?? { conn: null, promise: null };
globalForMongoose.mongooseCache = cache;

export async function connectDB() {
  if (cache.conn) return cache.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set. Add it to superadmin/backend/.env");

  // Fail fast instead of hanging if Atlas is unreachable or a socket stalls.
  cache.promise ??= mongoose.connect(uri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 10_000,
    socketTimeoutMS: 30_000,
    maxPoolSize: 10,
  });
  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }
  return cache.conn;
}

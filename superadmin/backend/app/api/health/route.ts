import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { json, preflight } from "@/lib/cors";

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function GET(request: Request) {
  try {
    await connectDB();
    return json(request, { ok: true, db: mongoose.connection.readyState === 1 ? "connected" : "connecting" });
  } catch (err) {
    return json(request, { ok: false, db: "error", error: (err as Error).message }, 503);
  }
}

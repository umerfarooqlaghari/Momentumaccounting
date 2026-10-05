import { HttpError } from "./auth";
import { json } from "./cors";
import { connectDB } from "./db";

type Ctx = { params: Promise<Record<string, string>> };

/** Wraps a route handler: connects to MongoDB and turns thrown errors into JSON responses with CORS headers. */
export function handler(fn: (request: Request, params: Record<string, string>) => Promise<Response>) {
  return async (request: Request, ctx: Ctx) => {
    try {
      await connectDB();
      return await fn(request, ctx?.params ? await ctx.params : {});
    } catch (err) {
      if (err instanceof HttpError) return json(request, { error: err.message }, err.status);
      const e = err as { code?: number; name?: string; message?: string };
      if (e.code === 11000) return json(request, { error: "An item with that slug or key already exists" }, 409);
      if (e.name === "ValidationError" || e.name === "CastError") return json(request, { error: e.message }, 422);
      console.error("[api]", err);
      return json(request, { error: "Server error" }, 500);
    }
  };
}

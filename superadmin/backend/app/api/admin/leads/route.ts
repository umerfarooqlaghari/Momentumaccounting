import { json, preflight } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { requireRole } from "@/lib/auth";
import { leadFilter } from "@/lib/lead-query";
import { Lead } from "@/models/Lead";

export const OPTIONS = preflight;

export const GET = handler(async (request) => {
  await requireRole(request, ["leads"]);
  const params = new URL(request.url).searchParams;
  const page = Math.max(1, Number(params.get("page") ?? 1));
  const limit = Math.min(200, Number(params.get("limit") ?? 50));
  const filter = leadFilter(params);
  const [items, total] = await Promise.all([
    Lead.find(filter)
      .select("name email businessName turnover legalStructure score status createdAt updatedAt hqSync.status firstSource activity.type")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Lead.countDocuments(filter),
  ]);
  return json(request, { items, total, page, limit });
});

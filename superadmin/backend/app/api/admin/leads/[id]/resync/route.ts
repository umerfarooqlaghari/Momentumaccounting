import { json, preflight } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { requireRole } from "@/lib/auth";
import { hqConfigured, syncLeadToHq } from "@/lib/hq";
import { Lead } from "@/models/Lead";

export const OPTIONS = preflight;

export const POST = handler(async (request, { id }) => {
  await requireRole(request, ["leads"]);
  if (!hqConfigured()) return json(request, { ok: false, error: "Momentum HQ connection is not configured yet" }, 409);
  await Lead.updateOne({ _id: id }, { $set: { "hqSync.status": "pending", "hqSync.attempts": 0 } });
  const result = await syncLeadToHq(id);
  return json(request, result, result.ok ? 200 : 502);
});

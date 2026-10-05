import { json, preflight } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { getResource } from "@/lib/resources";
import { modelFor } from "@/lib/models";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const OPTIONS = preflight;

// Logs 404s from the website so missing redirects can be spotted (MA-103).
export const POST = handler(async (request) => {
  if (!rateLimit(`404:${clientIp(request)}`, 30, 60_000)) return json(request, { ok: true });
  const { path, referrer } = (await request.json().catch(() => ({}))) as { path?: string; referrer?: string };
  if (!path || !path.startsWith("/") || path.length > 300) return json(request, { ok: false }, 422);
  await modelFor(getResource("notFoundLogs")!).updateOne(
    { path },
    { $inc: { count: 1 }, $set: { lastSeen: new Date(), referrer: referrer?.slice(0, 300) ?? "" } },
    { upsert: true },
  );
  return json(request, { ok: true });
});

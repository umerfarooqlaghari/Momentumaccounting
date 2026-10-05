import { LEAD_STATUSES, LEAD_TYPES } from "@/models/Lead";

/** Builds a Mongo filter from the leads console query string. */
export function leadFilter(params: URLSearchParams) {
  const filter: Record<string, unknown> = {};
  const status = params.get("status");
  if (status && (LEAD_STATUSES as readonly string[]).includes(status)) filter.status = status;
  const score = params.get("score");
  if (score) filter.score = score;
  const type = params.get("type");
  if (type && (LEAD_TYPES as readonly string[]).includes(type)) filter["activity.type"] = type;
  const source = params.get("source");
  if (source) filter["firstSource.utmSource"] = source;
  const campaign = params.get("campaign");
  if (campaign) filter["firstSource.utmCampaign"] = campaign;
  const hq = params.get("hq");
  if (hq) filter["hqSync.status"] = hq;
  const from = params.get("from");
  const to = params.get("to");
  if (from || to) {
    filter.createdAt = {
      ...(from ? { $gte: new Date(from) } : {}),
      ...(to ? { $lte: new Date(`${to}T23:59:59`) } : {}),
    };
  }
  const q = params.get("q")?.trim();
  if (q) {
    const rx = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    filter.$or = [{ name: rx }, { email: rx }, { businessName: rx }];
  }
  return filter;
}

/** Channel used in reports: UTM source, else referrer host, else "direct". */
export function channelOf(src?: { utmSource?: string; referrer?: string } | null) {
  if (src?.utmSource) return src.utmSource;
  if (src?.referrer) {
    try {
      return new URL(src.referrer).hostname.replace(/^www\./, "");
    } catch {}
  }
  return "direct";
}

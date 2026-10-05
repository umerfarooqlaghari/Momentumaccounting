import { json, preflight } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { requireRole } from "@/lib/auth";
import { channelOf } from "@/lib/lead-query";
import { getResource } from "@/lib/resources";
import { modelFor } from "@/lib/models";
import { Lead } from "@/models/Lead";

export const OPTIONS = preflight;

type Row = { key: string; leads: number; ideal: number; won: number };

function tally(map: Map<string, Row>, key: string, lead: { score?: string; status?: string }) {
  const row = map.get(key) ?? { key, leads: 0, ideal: 0, won: 0 };
  row.leads++;
  if (lead.score === "ideal") row.ideal++;
  if (lead.status === "won") row.won++;
  map.set(key, row);
}

// Leads by source, campaign, page and type, plus the monthly report (§10).
export const GET = handler(async (request) => {
  await requireRole(request, ["leads"]);
  const params = new URL(request.url).searchParams;
  const months = Math.min(24, Number(params.get("months") ?? 6));
  const since = new Date();
  since.setMonth(since.getMonth() - months + 1, 1);
  since.setHours(0, 0, 0, 0);

  const leads = await Lead.find({ createdAt: { $gte: since } })
    .select("createdAt score status firstSource activity.type")
    .lean();

  const bySource = new Map<string, Row>();
  const byCampaign = new Map<string, Row>();
  const byPage = new Map<string, Row>();
  const byType = new Map<string, Row>();
  const byMonth = new Map<string, Row>();
  const byStatus: Record<string, number> = {};

  for (const l of leads) {
    const src = (l.firstSource ?? {}) as { utmSource?: string; utmCampaign?: string; referrer?: string; pageUrl?: string };
    tally(bySource, channelOf(src), l);
    tally(byCampaign, src.utmCampaign || "(none)", l);
    let page = "(unknown)";
    try {
      if (src.pageUrl) page = new URL(src.pageUrl).pathname;
    } catch {}
    tally(byPage, page, l);
    tally(byType, l.activity?.[0]?.type ?? "enquiry", l);
    tally(byMonth, new Date(l.createdAt as Date).toISOString().slice(0, 7), l);
    byStatus[l.status ?? "new"] = (byStatus[l.status ?? "new"] ?? 0) + 1;
  }

  const metrics = (await modelFor(getResource("monthlyMetrics")!).find().lean()) as unknown as {
    month: string;
    adSpend?: number;
    managementFee?: number;
    visitors?: number;
  }[];
  const metricByMonth = new Map(metrics.map((m) => [m.month, m]));

  const monthly = [...byMonth.values()]
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((row) => {
      const m = metricByMonth.get(row.key);
      const spend = (m?.adSpend ?? 0) + (m?.managementFee ?? 0);
      return {
        month: row.key,
        visitors: m?.visitors ?? null,
        leads: row.leads,
        idealLeads: row.ideal,
        won: row.won,
        adSpend: m?.adSpend ?? 0,
        costPerLead: spend && row.leads ? Math.round((spend / row.leads) * 100) / 100 : null,
        conversionRate: row.leads ? Math.round((row.won / row.leads) * 1000) / 10 : 0,
        visitorToLead: m?.visitors ? Math.round((row.leads / m.visitors) * 1000) / 10 : null,
      };
    });

  const sorted = (m: Map<string, Row>) => [...m.values()].sort((a, b) => b.leads - a.leads);
  return json(request, {
    since,
    total: leads.length,
    byStatus,
    bySource: sorted(bySource),
    byCampaign: sorted(byCampaign),
    byPage: sorted(byPage).slice(0, 20),
    byType: sorted(byType),
    monthly,
  });
});

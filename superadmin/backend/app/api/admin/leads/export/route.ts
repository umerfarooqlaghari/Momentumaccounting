import { corsHeaders } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { requireRole } from "@/lib/auth";
import { leadFilter } from "@/lib/lead-query";
import { Lead } from "@/models/Lead";

const cols = ["createdAt", "name", "email", "phone", "businessName", "legalStructure", "turnover", "services", "currentAccountant", "heardAbout", "score", "status", "utmSource", "utmMedium", "utmCampaign", "pageUrl", "marketingOptIn", "hqSync"];

const cell = (v: unknown) => {
  const s = v instanceof Date ? v.toISOString() : Array.isArray(v) ? v.join("; ") : String(v ?? "");
  // Prevent spreadsheet formula injection.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
};

export const GET = handler(async (request) => {
  await requireRole(request, ["leads"]);
  const leads = await Lead.find(leadFilter(new URL(request.url).searchParams)).sort({ createdAt: -1 }).lean();
  const rows = leads.map((l) => {
    const src = (l.firstSource ?? {}) as Record<string, string>;
    const map: Record<string, unknown> = {
      ...l,
      utmSource: src.utmSource,
      utmMedium: src.utmMedium,
      utmCampaign: src.utmCampaign,
      pageUrl: src.pageUrl,
      marketingOptIn: l.consent?.marketingOptIn,
      hqSync: l.hqSync?.status,
    };
    return cols.map((c) => cell(map[c])).join(",");
  });
  const csv = [cols.join(","), ...rows].join("\n");
  return new Response(csv, {
    headers: {
      ...corsHeaders(request),
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
});

import { json } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { requireRole } from "@/lib/auth";
import { emailConfigured } from "@/lib/email";
import { hqConfigured } from "@/lib/hq";
import { Revision } from "@/lib/models";
import { Lead } from "@/models/Lead";

export const GET = handler(async (request) => {
  await requireRole(request, ["owner", "editor", "leads"]);
  const weekAgo = new Date(Date.now() - 7 * 86_400_000);
  const monthAgo = new Date(Date.now() - 30 * 86_400_000);
  const [newThisWeek, newThisMonth, openLeads, wonThisMonth, hqPending, hqFailed, recentLeads, recentEdits] = await Promise.all([
    Lead.countDocuments({ createdAt: { $gte: weekAgo } }),
    Lead.countDocuments({ createdAt: { $gte: monthAgo } }),
    Lead.countDocuments({ status: { $in: ["new", "contacted", "call_booked", "proposal_sent"] } }),
    Lead.countDocuments({ status: "won", updatedAt: { $gte: monthAgo } }),
    Lead.countDocuments({ "hqSync.status": "pending" }),
    Lead.countDocuments({ "hqSync.status": "failed" }),
    Lead.find().select("name businessName score status createdAt").sort({ createdAt: -1 }).limit(6).lean(),
    Revision.find().select("resource action by createdAt").sort({ createdAt: -1 }).limit(6).lean(),
  ]);
  return json(request, {
    stats: { newThisWeek, newThisMonth, openLeads, wonThisMonth },
    health: { hqConfigured: hqConfigured(), hqPending, hqFailed, emailConfigured: emailConfigured() },
    recentLeads,
    recentEdits,
  });
});

import { json } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { HttpError } from "@/lib/auth";
import { retryPendingLeads } from "@/lib/hq";
import { runNurture } from "@/lib/lead-pipeline";
import { getSettings } from "@/lib/settings";
import { Lead } from "@/models/Lead";

// Scheduled jobs, called by the host's cron (e.g. every 10 minutes) with Authorization: Bearer CRON_SECRET.
//   /api/cron/hq-sync    retry leads that failed to reach Momentum HQ
//   /api/cron/nurture    send due follow-up emails
//   /api/cron/retention  delete unconverted leads past the retention period (UK GDPR)
export const GET = handler(async (request, { job }) => {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) throw new HttpError(401, "Unauthorised");

  if (job === "hq-sync") return json(request, await retryPendingLeads());
  if (job === "nurture") return json(request, await runNurture());
  if (job === "retention") {
    const months = Number((await getSettings()).leadRetentionMonths ?? 24);
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - months);
    const res = await Lead.deleteMany({ status: { $in: ["new", "contacted", "lost"] }, updatedAt: { $lt: cutoff } });
    return json(request, { deleted: res.deletedCount, olderThan: cutoff });
  }
  throw new HttpError(404, "Unknown job");
});
export const POST = GET;

import { Lead } from "@/models/Lead";

// Momentum HQ integration (§6). The exact contract is defined in docs/momentum-hq-integration-spec.md
// and will be confirmed once HQ's technical details are shared under NDA.
export function hqConfigured() {
  return !!process.env.MOMENTUM_HQ_API_URL;
}

const MAX_ATTEMPTS = 10;

// Exponential backoff: 1, 2, 4, 8 … minutes, capped at 6 hours.
function nextRetryDelayMs(attempts: number) {
  return Math.min(60_000 * 2 ** Math.max(attempts - 1, 0), 6 * 60 * 60_000);
}

export function hqPayload(lead: Record<string, unknown> & { _id: unknown }) {
  const rest: Record<string, unknown> = { ...lead };
  for (const k of ["_id", "notes", "statusHistory", "nurture", "hqSync", "__v"]) delete rest[k];
  return { websiteLeadId: String(lead._id), ...rest };
}

/** Pushes one lead to Momentum HQ. Never throws: failures are recorded and retried by the cron job. */
export async function syncLeadToHq(leadId: string) {
  if (!hqConfigured()) return { ok: false, reason: "not_configured" };
  const lead = await Lead.findById(leadId);
  if (!lead) return { ok: false, reason: "not_found" };

  const attempts = (lead.hqSync?.attempts ?? 0) + 1;
  try {
    const res = await fetch(process.env.MOMENTUM_HQ_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MOMENTUM_HQ_API_KEY ?? ""}`,
        // Lets HQ treat retries of the same lead as one operation.
        "Idempotency-Key": `${lead._id}-${lead.updatedAt?.getTime?.() ?? ""}`,
      },
      body: JSON.stringify(hqPayload(lead.toObject())),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`HQ responded ${res.status}`);
    const body = (await res.json().catch(() => ({}))) as { id?: string };
    lead.hqSync = { status: "synced", hqId: body.id ?? lead.hqSync?.hqId, attempts, lastAttemptAt: new Date(), lastError: undefined };
    await lead.save();
    return { ok: true };
  } catch (err) {
    lead.hqSync = {
      ...lead.hqSync,
      status: attempts >= MAX_ATTEMPTS ? "failed" : "pending",
      attempts,
      lastError: (err as Error).message,
      lastAttemptAt: new Date(),
    };
    await lead.save();
    return { ok: false, reason: (err as Error).message };
  }
}

/** Retries pending leads whose backoff has elapsed. Called by /api/cron/hq-sync. */
export async function retryPendingLeads(limit = 50) {
  if (!hqConfigured()) return { processed: 0, reason: "not_configured" };
  const pending = await Lead.find({ "hqSync.status": "pending" }).sort({ updatedAt: 1 }).limit(limit * 3).lean();
  const now = Date.now();
  const due = pending
    .filter((l) => {
      const s = l.hqSync as { attempts?: number; lastAttemptAt?: Date } | undefined;
      if (!s?.lastAttemptAt) return true;
      return new Date(s.lastAttemptAt).getTime() + nextRetryDelayMs(s.attempts ?? 0) <= now;
    })
    .slice(0, limit);
  let synced = 0;
  for (const l of due) if ((await syncLeadToHq(String(l._id))).ok) synced++;
  const failed = await Lead.countDocuments({ "hqSync.status": "failed" });
  return { processed: due.length, synced, failedTotal: failed };
}

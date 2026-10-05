import { json, preflight } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { HttpError, requireRole } from "@/lib/auth";
import { syncLeadToHq } from "@/lib/hq";
import { Lead, LEAD_STATUSES } from "@/models/Lead";

export const OPTIONS = preflight;

export const GET = handler(async (request, { id }) => {
  await requireRole(request, ["leads"]);
  const lead = await Lead.findById(id).lean();
  if (!lead) throw new HttpError(404, "Not found");
  return json(request, { item: lead });
});

// Update pipeline status and/or add a note.
export const PATCH = handler(async (request, { id }) => {
  const session = await requireRole(request, ["leads"]);
  const { status, note } = (await request.json()) as { status?: string; note?: string };
  const lead = await Lead.findById(id);
  if (!lead) throw new HttpError(404, "Not found");

  if (status && status !== lead.status) {
    if (!(LEAD_STATUSES as readonly string[]).includes(status)) throw new HttpError(422, "Unknown status");
    lead.statusHistory.push({ from: lead.status, to: status, by: session.email, at: new Date() });
    lead.status = status as (typeof LEAD_STATUSES)[number];
    // Once the team is talking to the prospect, stop automated follow-ups.
    if (status !== "new" && !lead.nurture?.stopped) {
      lead.nurture = { ...lead.nurture, stopped: true, stoppedReason: `status_${status}`, nextAt: undefined };
    }
    lead.hqSync = { ...lead.hqSync, status: "pending" };
  }
  if (note?.trim()) lead.notes.push({ text: note.trim(), by: session.email, at: new Date() });
  await lead.save();
  void syncLeadToHq(String(lead._id));
  return json(request, { item: lead });
});

// Right to erasure (UK GDPR): permanently deletes the lead.
export const DELETE = handler(async (request, { id }) => {
  await requireRole(request, ["owner"]);
  const res = await Lead.findByIdAndDelete(id);
  if (!res) throw new HttpError(404, "Not found");
  return json(request, { ok: true });
});

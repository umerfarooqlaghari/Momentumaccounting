import { createHmac, timingSafeEqual } from "node:crypto";
import { json } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { syncLeadToHq } from "@/lib/hq";
import { Lead } from "@/models/Lead";

// Cal.com webhook (BOOKING_CREATED / RESCHEDULED / CANCELLED). Signed with BOOKING_WEBHOOK_SECRET
// via the x-cal-signature-256 header (MA-073).
function validSignature(raw: string, signature: string | null) {
  const secret = process.env.BOOKING_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

type CalPayload = {
  triggerEvent?: string;
  payload?: {
    uid?: string;
    startTime?: string;
    attendees?: { name?: string; email?: string }[];
    responses?: Record<string, { value?: unknown }>;
    metadata?: Record<string, string>;
  };
};

export const POST = handler(async (request) => {
  const raw = await request.text();
  if (!validSignature(raw, request.headers.get("x-cal-signature-256"))) {
    return json(request, { error: "Invalid signature" }, 401);
  }
  const body = JSON.parse(raw) as CalPayload;
  const p = body.payload ?? {};
  const attendee = p.attendees?.[0];
  if (!attendee?.email) return json(request, { error: "No attendee email" }, 422);

  const event = body.triggerEvent ?? "BOOKING_CREATED";
  const cancelled = event === "BOOKING_CANCELLED";
  const answers = Object.fromEntries(Object.entries(p.responses ?? {}).map(([k, v]) => [k, typeof v?.value === "string" ? v.value : JSON.stringify(v?.value)]));
  const activity = { type: "booking" as const, answers: { event, startTime: p.startTime, ...answers }, attribution: { utmSource: p.metadata?.utm_source, utmCampaign: p.metadata?.utm_campaign }, at: new Date() };

  let lead = await Lead.findOne({ email: attendee.email.toLowerCase() });
  if (!lead) {
    lead = new Lead({
      name: attendee.name || attendee.email,
      email: attendee.email,
      status: cancelled ? "new" : "call_booked",
      firstSource: activity.attribution,
      activity: [],
      consent: { privacyAccepted: true, marketingOptIn: false, wordingVersion: "booking-tool", at: new Date() },
      nurture: { stopped: true, stoppedReason: "booked" },
    });
  }
  lead.activity.push(activity);
  lead.booking = { uid: p.uid, startTime: p.startTime ? new Date(p.startTime) : undefined, status: event };
  if (!cancelled && ["new", "contacted"].includes(lead.status)) {
    lead.statusHistory.push({ from: lead.status, to: "call_booked", by: "booking-webhook", at: new Date() });
    lead.status = "call_booked";
  }
  lead.nurture = { ...lead.nurture, stopped: true, stoppedReason: "booked", nextAt: undefined };
  lead.hqSync = { ...lead.hqSync, status: "pending" };
  await lead.save();
  void syncLeadToHq(String(lead._id));
  return json(request, { ok: true });
});

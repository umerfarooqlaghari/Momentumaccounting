import { after } from "next/server";
import { connectDB } from "@/lib/db";
import { json, preflight } from "@/lib/cors";
import { leadInputSchema, scoreLead } from "@/lib/lead-validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { afterLeadSubmitted, firstNurtureDate } from "@/lib/lead-pipeline";
import { getResource } from "@/lib/resources";
import { modelFor } from "@/lib/models";
import { publicApiUrl, signToken } from "@/lib/tokens";
import { Lead } from "@/models/Lead";

export function OPTIONS(request: Request) {
  return preflight(request);
}

// Single intake for every lead source on the website (prospectus §6.1). Returning prospects are
// matched by email and updated rather than duplicated.
export async function POST(request: Request) {
  if (!rateLimit(`lead:${clientIp(request)}`, 10, 60_000)) {
    return json(request, { error: "Too many requests. Please try again in a minute." }, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(request, { error: "Invalid JSON" }, 400);
  }

  const parsed = leadInputSchema.safeParse(body);
  if (!parsed.success) {
    return json(request, { error: "Validation failed", issues: parsed.error.issues }, 422);
  }
  const { type, answers = {}, attribution, consent, website, ...contact } = parsed.data;

  // Honeypot tripped: pretend success so bots don't retry.
  if (website) return json(request, { ok: true }, 201);

  try {
    await connectDB();
  } catch (err) {
    console.error("[leads] database unavailable", err);
    return json(request, { error: "Service temporarily unavailable" }, 503);
  }

  // Downloads: resolve the requested file and create a signed, expiring link.
  let downloadUrl: string | undefined;
  if (type === "download") {
    const slug = String(answers.magnet ?? "");
    const magnet = (await modelFor(getResource("leadMagnets")!).findOne({ slug, published: true }).lean()) as
      | { title?: string; file?: string }
      | null;
    if (!magnet) return json(request, { error: "Unknown download" }, 404);
    answers.magnetTitle = magnet.title;
    if (magnet.file) {
      downloadUrl = `${publicApiUrl()}/api/public/download?token=${await signToken({ file: magnet.file, slug }, "7d")}`;
    }
  }

  const activity = { type, answers, attribution, at: new Date() };
  // Only overwrite profile fields that were actually provided in this submission.
  const profile = Object.fromEntries(Object.entries(contact).filter(([, v]) => v !== undefined && v !== ""));

  const existing = await Lead.findOne({ email: contact.email.toLowerCase() });
  let lead;

  if (existing) {
    existing.set(profile);
    existing.score = scoreLead({ legalStructure: existing.legalStructure ?? undefined, turnover: existing.turnover ?? undefined });
    existing.activity.push(activity);
    if (consent.marketingOptIn && !existing.consent?.marketingOptIn) {
      existing.consent = { ...existing.consent, marketingOptIn: true, wordingVersion: consent.wordingVersion, at: new Date() };
      if (existing.status === "new" && !existing.nurture?.step) {
        existing.nurture = { step: 0, stopped: false, nextAt: await firstNurtureDate(true) };
      }
    }
    existing.hqSync = { ...existing.hqSync, status: "pending" };
    lead = await existing.save();
  } else {
    lead = await Lead.create({
      ...profile,
      score: scoreLead(contact),
      status: "new",
      firstSource: attribution,
      activity: [activity],
      consent: { ...consent, at: new Date() },
      nurture: { step: 0, stopped: !consent.marketingOptIn, nextAt: await firstNurtureDate(consent.marketingOptIn) },
    });
  }

  // HQ sync and emails run after the response is sent, so the visitor isn't kept waiting.
  const plain = lead.toObject();
  after(() => afterLeadSubmitted(plain, { type, answers, isNew: !existing, downloadUrl }));

  return json(request, { ok: true, id: lead._id, duplicate: !!existing, downloadUrl }, existing ? 200 : 201);
}

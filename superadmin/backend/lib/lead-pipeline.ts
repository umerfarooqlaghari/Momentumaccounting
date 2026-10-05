import { Lead } from "@/models/Lead";
import { getSettings, getTemplate } from "./settings";
import { fillTemplate, sendEmail } from "./email";
import { syncLeadToHq } from "./hq";
import { publicApiUrl, signToken } from "./tokens";

type LeadLike = {
  _id: unknown;
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  legalStructure?: string;
  turnover?: string;
  services?: string[];
  score?: string;
  firstSource?: Record<string, string | undefined>;
};

function summary(lead: LeadLike, type: string, answers: Record<string, unknown>) {
  const src = lead.firstSource ?? {};
  const lines = [
    `- **Type:** ${type}`,
    `- **Fit:** ${lead.score}`,
    `- **Name:** ${lead.name}`,
    `- **Email:** ${lead.email}`,
    lead.phone && `- **Phone:** ${lead.phone}`,
    lead.businessName && `- **Business:** ${lead.businessName}`,
    lead.legalStructure && `- **Structure:** ${lead.legalStructure}`,
    lead.turnover && `- **Turnover:** ${lead.turnover}`,
    lead.services?.length && `- **Services:** ${lead.services.join(", ")}`,
    src.utmSource && `- **Source:** ${src.utmSource} / ${src.utmMedium ?? ""} / ${src.utmCampaign ?? ""}`,
    src.pageUrl && `- **Page:** ${src.pageUrl}`,
    ...Object.entries(answers)
      .filter(([, v]) => v !== undefined && v !== "" && typeof v !== "object")
      .map(([k, v]) => `- **${k}:** ${v}`),
  ];
  return lines.filter(Boolean).join("\n");
}

export async function unsubscribeUrl(leadId: string) {
  return `${publicApiUrl()}/api/public/unsubscribe?token=${await signToken({ leadId }, "365d")}`;
}

/** Runs after every lead submission: HQ sync, team notification, prospect acknowledgement. Never throws. */
export async function afterLeadSubmitted(lead: LeadLike, opts: { type: string; answers: Record<string, unknown>; isNew: boolean; downloadUrl?: string }) {
  const id = String(lead._id);
  const tasks: Promise<unknown>[] = [syncLeadToHq(id)];

  try {
    const settings = await getSettings();
    const vars = {
      name: lead.name.split(" ")[0],
      businessName: lead.businessName,
      bookingUrl: settings.bookingUrl || `${process.env.FRONTEND_URL ?? ""}/book-a-call`,
      downloadUrl: opts.downloadUrl,
      leadSummary: summary(lead, opts.type, opts.answers),
      adminLeadUrl: `${process.env.SUPERADMIN_URL ?? ""}/leads/${id}`,
    };

    const recipients = settings.notificationEmails?.filter(Boolean) ?? [];
    const teamTpl = await getTemplate("team_notification");
    if (recipients.length && teamTpl) {
      tasks.push(
        sendEmail({
          to: recipients,
          replyTo: lead.email,
          subject: fillTemplate(teamTpl.subject, vars),
          markdown: fillTemplate(teamTpl.body, vars),
        }),
      );
    }

    const ackKey = opts.type === "download" && opts.downloadUrl ? "download_delivery" : "lead_acknowledgement";
    const ackTpl = await getTemplate(ackKey);
    if (ackTpl) {
      tasks.push(sendEmail({ to: lead.email, replyTo: settings.email, subject: fillTemplate(ackTpl.subject, vars), markdown: fillTemplate(ackTpl.body, vars) }));
    }
  } catch (err) {
    console.error("[lead-pipeline] email step failed", err);
  }

  const results = await Promise.allSettled(tasks);
  results.filter((r) => r.status === "rejected").forEach((r) => console.error("[lead-pipeline]", (r as PromiseRejectedResult).reason));
}

/** Sends due follow-up emails. Called by /api/cron/nurture. */
export async function runNurture(limit = 100) {
  const now = new Date();
  const due = await Lead.find({
    "nurture.stopped": { $ne: true },
    "nurture.nextAt": { $lte: now },
    "consent.marketingOptIn": true,
    status: "new",
  }).limit(limit);

  let sent = 0;
  for (const lead of due) {
    const step = (lead.nurture?.step ?? 0) + 1;
    const tpl = await getTemplate(`nurture_${step}`);
    if (!tpl) {
      lead.nurture = { ...lead.nurture, stopped: true, stoppedReason: "sequence_complete", nextAt: undefined };
      await lead.save();
      continue;
    }
    const settings = await getSettings();
    const vars = {
      name: lead.name.split(" ")[0],
      businessName: lead.businessName ?? undefined,
      bookingUrl: settings.bookingUrl || `${process.env.FRONTEND_URL ?? ""}/book-a-call`,
    };
    try {
      await sendEmail({
        to: lead.email,
        replyTo: settings.email,
        subject: fillTemplate(tpl.subject, vars),
        markdown: fillTemplate(tpl.body, vars),
        unsubscribeUrl: await unsubscribeUrl(String(lead._id)),
      });
      sent++;
    } catch (err) {
      console.error("[nurture] send failed", err);
      continue;
    }
    const nextTpl = await getTemplate(`nurture_${step + 1}`);
    lead.nurture = {
      step,
      stopped: !nextTpl,
      stoppedReason: nextTpl ? undefined : "sequence_complete",
      nextAt: nextTpl ? new Date(Date.now() + Math.max(nextTpl.delayDays ?? 3, 1) * 86_400_000) : undefined,
    };
    await lead.save();
  }
  return { due: due.length, sent };
}

/** First nurture email date for a new lead, or undefined when no sequence applies. */
export async function firstNurtureDate(marketingOptIn: boolean) {
  if (!marketingOptIn) return undefined;
  const tpl = await getTemplate("nurture_1");
  if (!tpl) return undefined;
  return new Date(Date.now() + Math.max(tpl.delayDays ?? 1, 0) * 86_400_000);
}

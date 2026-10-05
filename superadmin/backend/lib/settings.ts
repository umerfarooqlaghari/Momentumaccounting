import { getResource } from "./resources";
import { modelFor } from "./models";

export type SiteSettings = Record<string, unknown> & {
  businessName?: string;
  email?: string;
  phone?: string;
  bookingUrl?: string;
  notificationEmails?: string[];
  leadRetentionMonths?: number;
};

export async function getSettings(): Promise<SiteSettings> {
  const doc = await modelFor(getResource("settings")!).findOne().lean();
  return (doc ?? {}) as SiteSettings;
}

export async function getTemplate(key: string) {
  const doc = await modelFor(getResource("emailTemplates")!).findOne({ key, active: true }).lean();
  return doc as { subject: string; body: string; delayDays?: number } | null;
}

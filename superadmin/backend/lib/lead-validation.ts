import { z } from "zod";
import { LEAD_TYPES } from "@/models/Lead";

const optionalText = z.string().trim().max(500).optional();

export const leadInputSchema = z.object({
  // "booking" only arrives through the signed booking webhook, never from the public form.
  type: z.enum(LEAD_TYPES).exclude(["booking"]),
  name: z.string().trim().min(2).max(120),
  email: z.email().max(200),
  phone: z.string().trim().max(40).optional(),
  businessName: optionalText,
  legalStructure: optionalText,
  turnover: optionalText,
  services: z.array(z.string().max(80)).max(20).optional(),
  currentAccountant: optionalText,
  heardAbout: optionalText,
  message: z.string().trim().max(3000).optional(),
  answers: z.record(z.string(), z.unknown()).optional(),
  attribution: z
    .object({
      pageUrl: optionalText,
      referrer: optionalText,
      utmSource: optionalText,
      utmMedium: optionalText,
      utmCampaign: optionalText,
      utmTerm: optionalText,
      utmContent: optionalText,
      gclid: optionalText,
      fbclid: optionalText,
    })
    .optional(),
  consent: z.object({
    privacyAccepted: z.literal(true),
    marketingOptIn: z.boolean().default(false),
    wordingVersion: z.string().max(40).optional(),
  }),
  // Honeypot: real users never fill this hidden field.
  website: z.string().max(0).optional(),
});

export type LeadInput = z.infer<typeof leadInputSchema>;

// Ideal client per prospectus §3.1: limited company, £100k–£5m turnover.
const IDEAL_TURNOVER = ["£100k–£250k", "£250k–£500k", "£500k–£1m", "£1m–£5m"];

export function scoreLead(input: Pick<LeadInput, "legalStructure" | "turnover">) {
  const isLtd = input.legalStructure === "Limited company";
  const inBand = !!input.turnover && IDEAL_TURNOVER.includes(input.turnover);
  if (isLtd && inBand) return "ideal";
  if (isLtd || inBand || !input.turnover) return "possible";
  return "not_a_fit";
}

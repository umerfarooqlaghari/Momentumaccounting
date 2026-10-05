"use client";

import { getAttribution } from "./attribution";
import { apiUrl } from "./site";

export const CONSENT_VERSION = "2026-10-v1";

export type LeadType = "enquiry" | "quote" | "quiz" | "download" | "calculator" | "landing_page";

export type LeadPayload = {
  type: LeadType;
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  legalStructure?: string;
  turnover?: string;
  services?: string[];
  currentAccountant?: string;
  heardAbout?: string;
  message?: string;
  answers?: Record<string, unknown>;
  marketingOptIn: boolean;
  website?: string; // honeypot
};

/** Sends any website lead to the backend (→ MongoDB → Momentum HQ). */
export async function submitLead({ marketingOptIn, ...payload }: LeadPayload) {
  const res = await fetch(`${apiUrl}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      attribution: getAttribution(),
      consent: { privacyAccepted: true, marketingOptIn, wordingVersion: CONSENT_VERSION },
    }),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return (await res.json()) as { ok: boolean; id: string; downloadUrl?: string };
}

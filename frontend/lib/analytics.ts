"use client";

type Fn = (...args: unknown[]) => void;
declare global {
  interface Window {
    gtag?: Fn;
    dataLayer?: unknown[];
    fbq?: Fn;
    lintrk?: Fn;
    ttq?: { track: Fn; page: Fn };
    __maTracking?: { googleAdsId?: string; googleAdsLeadLabel?: string };
  }
}

export type TrackEvent =
  | "generate_lead"
  | "book_call"
  | "quiz_complete"
  | "download"
  | "calculator_use"
  | "click_to_call"
  | "click_email";

const META_EVENTS: Partial<Record<TrackEvent, string>> = {
  generate_lead: "Lead",
  book_call: "Schedule",
  download: "Lead",
  quiz_complete: "Lead",
};

/** Sends a conversion event to whichever tags the visitor has consented to. No-ops otherwise. */
export function track(event: TrackEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
  const ads = window.__maTracking;
  if (ads?.googleAdsId && ads.googleAdsLeadLabel && ["generate_lead", "book_call", "quiz_complete", "download"].includes(event)) {
    window.gtag?.("event", "conversion", { send_to: `${ads.googleAdsId}/${ads.googleAdsLeadLabel}` });
  }
  const meta = META_EVENTS[event];
  if (meta) window.fbq?.("track", meta, params);
  if (meta) window.ttq?.track(event === "book_call" ? "Schedule" : "SubmitForm");
}

// Captures first-touch UTM / click IDs for the session so every lead records its source (§6.1).
const KEY = "ma_attribution";
const PARAMS = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_term: "utmTerm",
  utm_content: "utmContent",
  gclid: "gclid",
  fbclid: "fbclid",
} as const;

export type Attribution = Partial<Record<(typeof PARAMS)[keyof typeof PARAMS] | "pageUrl" | "referrer", string>>;

export function captureAttribution() {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const qs = new URLSearchParams(window.location.search);
    const data: Attribution = { referrer: document.referrer || undefined };
    for (const [param, field] of Object.entries(PARAMS)) {
      const v = qs.get(param);
      if (v) data[field] = v;
    }
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Storage unavailable (private mode etc.) — attribution is best effort.
  }
}

export function getAttribution(): Attribution {
  let stored: Attribution = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
  } catch {}
  return { ...stored, pageUrl: window.location.href };
}

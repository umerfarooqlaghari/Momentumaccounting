import { cache } from "react";
import fallback from "./fallback-data.json";
import type { PageText, SiteData } from "./types";
import { apiUrl } from "./site";

const DEFAULT_SETTINGS = {
  businessName: "Momentum Accounting",
  legalName: "Momentum Accounting Ltd",
  tagline: "Building financial momentum for your business.",
};

function normalize(raw: Partial<SiteData>): SiteData {
  return {
    settings: { ...DEFAULT_SETTINGS, ...(raw.settings ?? {}) },
    services: raw.services ?? [],
    audiences: raw.audiences ?? [],
    testimonials: raw.testimonials ?? [],
    caseStudies: raw.caseStudies ?? [],
    posts: raw.posts ?? [],
    team: raw.team ?? [],
    faqs: raw.faqs ?? [],
    pages: raw.pages ?? [],
    locations: raw.locations ?? [],
    landingPages: raw.landingPages ?? [],
    leadMagnets: raw.leadMagnets ?? [],
    quiz: raw.quiz ?? null,
    calculator: raw.calculator ?? null,
  };
}

/**
 * All website content, edited in superadmin. Cached and refreshed when superadmin saves
 * (tag "content") or every 5 minutes. Falls back to the last snapshot if the backend is down,
 * so the website never breaks.
 */
export const getSite = cache(async (): Promise<SiteData> => {
  try {
    const res = await fetch(`${apiUrl}/api/public/site`, {
      next: { tags: ["content"], revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Backend responded ${res.status}`);
    return normalize(await res.json());
  } catch (err) {
    console.warn("[content] using fallback snapshot:", (err as Error).message);
    return normalize(fallback as unknown as Partial<SiteData>);
  }
});

/** Editable hero/CTA/SEO text for a page, merged over the built-in defaults. */
export async function getPageText(key: string, defaults: Omit<PageText, "key">) {
  const site = await getSite();
  const override = site.pages.find((p) => p.key === key) ?? ({} as Partial<PageText>);
  const pick = <K extends Exclude<keyof PageText, "key">>(k: K) => (override[k] ? override[k] : defaults[k]);
  return {
    heroEyebrow: pick("heroEyebrow"),
    heroTitle: pick("heroTitle"),
    heroText: pick("heroText"),
    ctaTitle: pick("ctaTitle"),
    ctaText: pick("ctaText"),
    seoTitle: pick("seoTitle"),
    seoDescription: pick("seoDescription"),
    ogImage: pick("ogImage"),
  };
}

export type GoogleReviews = { available: boolean; rating?: number; count?: number; url?: string; reviews?: { author: string; rating: number; text: string; time: string }[] };

export async function getGoogleReviews(): Promise<GoogleReviews> {
  try {
    const res = await fetch(`${apiUrl}/api/public/google-reviews`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) });
    return res.ok ? await res.json() : { available: false };
  } catch {
    return { available: false };
  }
}

// Same normalisation as next.config.ts: blank → default, add https:// if missing, drop trailing slash.
function normaliseUrl(raw: string | undefined, fallback: string) {
  const value = raw?.trim().replace(/\/+$/, "");
  if (!value) return fallback;
  return /^https?:\/\//.test(value) ? value : `https://${value}`;
}

export const siteUrl = normaliseUrl(process.env.NEXT_PUBLIC_SITE_URL, "https://momentumaccounting.uk");
export const apiUrl = normaliseUrl(process.env.NEXT_PUBLIC_API_URL, "http://localhost:4000");

const LOCAL = /localhost|127\.0\.0\.1/;

/** False when a deployed site still points at the default local API (NEXT_PUBLIC_API_URL not set). Browser only. */
export function apiReachable() {
  return !(LOCAL.test(apiUrl) && !LOCAL.test(window.location.hostname));
}

export const mediaUrl = (id?: string) => (id ? `${apiUrl}/api/media/${id}` : "");
// Next 16 blocks optimising images from private IPs, so serve local dev images directly.
export const unoptimizedMedia = /localhost|127\.0\.0\.1/.test(apiUrl);

export const mainNav = [
  { label: "Services", href: "/services" },
  { label: "Who we help", href: "/who-we-help" },
  { label: "Quarterly report", href: "/quarterly-report" },
  { label: "Tools", href: "/tools" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Resources", href: "/resources" },
] as const;

export const telHref = (phone?: string) => (phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : "");

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://momentumaccounting.uk";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

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

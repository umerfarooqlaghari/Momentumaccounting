import type { MetadataRoute } from "next";
import { getSite } from "@/lib/data";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { services, audiences, posts, caseStudies, locations, leadMagnets } = await getSite();
  const staticPaths = [
    "",
    "/services",
    "/monthly-package",
    "/who-we-help",
    "/quarterly-report",
    "/about",
    "/reviews",
    "/case-studies",
    "/resources",
    "/tools",
    "/tools/health-check",
    "/tools/salary-dividend-calculator",
    "/guides",
    "/contact",
    "/book-a-call",
    "/privacy-policy",
    "/cookie-policy",
    "/accessibility",
  ];
  return [
    ...staticPaths.map((p) => ({ url: `${siteUrl}${p}`, priority: p === "" ? 1 : 0.7 })),
    ...services.map((s) => ({ url: `${siteUrl}/services/${s.slug}`, priority: 0.8 })),
    ...audiences.map((a) => ({ url: `${siteUrl}/who-we-help/${a.slug}` })),
    ...posts.map((p) => ({ url: `${siteUrl}/resources/${p.slug}`, lastModified: p.date })),
    ...caseStudies.map((c) => ({ url: `${siteUrl}/case-studies/${c.slug}` })),
    ...locations.map((l) => ({ url: `${siteUrl}/accountants/${l.slug}`, priority: 0.8 })),
    ...leadMagnets.map((m) => ({ url: `${siteUrl}/guides/${m.slug}` })),
  ];
}

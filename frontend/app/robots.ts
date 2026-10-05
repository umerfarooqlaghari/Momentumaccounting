import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Block everything on staging / preview deployments.
  if (process.env.NEXT_PUBLIC_NOINDEX === "true") return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/thank-you", "/lp/", "/api/"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

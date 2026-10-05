import type { NextConfig } from "next";

const api = new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js inline bootstrap + consented tags (Google, Meta, LinkedIn, TikTok)
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://connect.facebook.net https://snap.licdn.com https://analytics.tiktok.com`,
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: ${api.origin} https://*.google-analytics.com https://*.googletagmanager.com https://www.facebook.com https://px.ads.linkedin.com https://*.googleusercontent.com`,
      "font-src 'self'",
      `connect-src 'self' ${api.origin} https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://www.google.com https://connect.facebook.net https://www.facebook.com https://px.ads.linkedin.com https://analytics.tiktok.com`,
      "frame-src https://cal.com https://*.cal.com https://calendly.com https://*.calendly.com https://www.instagram.com https://www.tiktok.com https://www.googletagmanager.com",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Each app has its own lockfile; pin the workspace root to this folder.
  turbopack: { root: process.cwd() },
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: api.protocol.replace(":", "") as "http" | "https", hostname: api.hostname, port: api.port, pathname: "/api/media/**" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

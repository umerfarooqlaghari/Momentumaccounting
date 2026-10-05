// Blank → default, adds https:// if missing, drops a trailing slash — so a small typo in the
// hosting dashboard doesn't break the admin.
export function normaliseUrl(raw: string | undefined, fallback: string) {
  const value = raw?.trim().replace(/\/+$/, "");
  if (!value) return fallback;
  return /^https?:\/\//.test(value) ? value : `https://${value}`;
}

export const publicBackendUrl = normaliseUrl(process.env.NEXT_PUBLIC_BACKEND_URL, "http://localhost:4000");
export const websiteUrl = normaliseUrl(process.env.NEXT_PUBLIC_WEBSITE_URL, "http://localhost:3000");

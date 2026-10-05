// Tells the public website to refresh its cached content after an edit in superadmin.

export type RevalidateResult =
  | { ok: true; status: number }
  | { ok: false; reason: "not_configured" | "secret_mismatch" | "http_error" | "unreachable"; detail: string };

function frontendUrl() {
  const raw = process.env.FRONTEND_URL?.trim().replace(/\/+$/, "");
  if (!raw) return "";
  return /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
}

export async function revalidateWebsite({ checkOnly = false } = {}): Promise<RevalidateResult> {
  const url = frontendUrl();
  const secret = process.env.REVALIDATE_SECRET?.trim();
  if (!url || !secret) {
    const missing = [!url && "FRONTEND_URL", !secret && "REVALIDATE_SECRET"].filter(Boolean).join(" and ");
    console.warn(`[revalidate] skipped: ${missing} not set on the backend`);
    return { ok: false, reason: "not_configured", detail: `${missing} not set on the backend` };
  }
  try {
    const res = await fetch(`${url}/api/revalidate${checkOnly ? "?check=1" : ""}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}` },
      signal: AbortSignal.timeout(10_000),
    });
    if (res.ok) return { ok: true, status: res.status };
    const detail =
      res.status === 503
        ? `REVALIDATE_SECRET is not set on the website (${url}).`
        : res.status === 401
        ? `The website at ${url} rejected the secret. REVALIDATE_SECRET must be identical on the backend and the website.`
        : `The website at ${url} responded ${res.status}`;
    console.warn(`[revalidate] ${detail}`);
    return { ok: false, reason: res.status === 401 ? "secret_mismatch" : "http_error", detail };
  } catch (err) {
    const detail = `Could not reach the website at ${url}: ${(err as Error).message}`;
    console.warn(`[revalidate] ${detail}`);
    return { ok: false, reason: "unreachable", detail };
  }
}

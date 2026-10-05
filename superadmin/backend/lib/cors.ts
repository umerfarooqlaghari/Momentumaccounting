// Browser origins allowed to call the API. Built from ALLOWED_ORIGINS plus FRONTEND_URL and
// SUPERADMIN_URL, normalised to scheme://host[:port] so trailing slashes, paths or a missing
// "https://" in the hosting dashboard don't silently block the website.
function toOrigin(raw: string) {
  const value = raw.trim();
  if (!value) return null;
  try {
    return new URL(/^https?:\/\//.test(value) ? value : `https://${value}`).origin;
  } catch {
    return null;
  }
}

const allowedOrigins = new Set(
  [...(process.env.ALLOWED_ORIGINS ?? "").split(","), process.env.FRONTEND_URL ?? "", process.env.SUPERADMIN_URL ?? ""]
    .map(toOrigin)
    .filter((o): o is string => !!o),
);
// www and non-www versions of the website are both allowed.
for (const o of [...allowedOrigins]) {
  const u = new URL(o);
  allowedOrigins.add(`${u.protocol}//${u.hostname.startsWith("www.") ? u.hostname.slice(4) : `www.${u.hostname}`}${u.port ? `:${u.port}` : ""}`);
}

export function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get("origin");
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
  if (origin && allowedOrigins.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

export function json(request: Request, body: unknown, status = 200) {
  return Response.json(body, { status, headers: corsHeaders(request) });
}

export function preflight(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

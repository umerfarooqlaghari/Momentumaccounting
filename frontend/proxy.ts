import { NextResponse, type NextRequest } from "next/server";
import { apiUrl } from "@/lib/site";

// Redirects managed in superadmin (e.g. old WordPress URLs, MA-103/115), cached for a minute.
// Built-in defaults keep the old site's URLs working even if the backend is unreachable.
const DEFAULTS: Rule[] = [
  { from: "/services/accounting-and-corporation-tax", to: "/services/year-end-accounts-corporation-tax", permanent: true },
  { from: "/commercial-accounting", to: "/monthly-package", permanent: true },
  { from: "/individuals", to: "/services/self-assessment", permanent: true },
  { from: "/blog", to: "/resources", permanent: true },
];

type Rule = { from: string; to: string; permanent: boolean };
let cache: { rules: Map<string, Rule>; at: number } | null = null;

async function rules() {
  if (cache && Date.now() - cache.at < 60_000) return cache.rules;
  let list = DEFAULTS;
  try {
    const res = await fetch(`${apiUrl}/api/public/redirects`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) list = [...DEFAULTS, ...((await res.json()) as { items: Rule[] }).items];
  } catch {}
  const map = new Map(list.map((r) => [r.from.replace(/\/+$/, "").toLowerCase() || "/", r]));
  cache = { rules: map, at: Date.now() };
  return map;
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/\/+$/, "").toLowerCase() || "/";
  const rule = (await rules()).get(path);
  if (!rule) return NextResponse.next();
  const target = rule.to.startsWith("http") ? rule.to : new URL(rule.to, request.url);
  return NextResponse.redirect(target, rule.permanent ? 308 : 307);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|icon.svg|opengraph-image|sitemap.xml|robots.txt).*)"],
};
